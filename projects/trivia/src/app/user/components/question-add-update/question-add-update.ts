import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, take, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { User, Category, Question, QuestionStatus, Answer, ApplicationSettings } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';

import * as userActions from '../../store/actions';
import { QuestionActions } from 'shared-library/core/store/actions/question.actions';

export class QuestionAddUpdate {

  tagsObs: Observable<string[]>;
  categoriesObs: Observable<Category[]>;

  subs: Subscription[] = [];

  // Properties
  categories: Category[];
  tags: string[];

  questionForm: FormGroup;
  question: Question;

  autoTags: string[] = []; // auto computed based on match within Q/A
  enteredTags: string[] = [];
  filteredTags$: Observable<string[]>;
  loaderBusy = false;
  user: User;
  applicationSettings: ApplicationSettings;

  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  // Constructor
  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    public utils: Utils,
    public questionAction: QuestionActions) {


    this.categoriesObs = store.select(appState.coreState).pipe(select(s => s.categories));
    this.tagsObs = store.select(appState.coreState).pipe(select(s => s.tags));

    this.store.select(appState.coreState).pipe(take(1)).subscribe(s => this.user = s.user);

    this.subs.push(this.categoriesObs.subscribe(categories => this.categories = categories));
    this.subs.push(this.tagsObs.subscribe(tags => this.tags = tags));




  }

  createDefaultForm(question: Question): FormArray {
    const fgs: FormGroup[] = question.answers.map(answer => {
      const fg = new FormGroup({
        answerText: new FormControl(answer.answerText,
          Validators.compose([Validators.required, Validators.maxLength(this.applicationSettings.answer_max_length)])),
        correct: new FormControl(answer.correct),
      });
      return fg;
    });
    const answersFA = new FormArray(fgs);
    return answersFA;
  }

  addTag(tag: string) {
    if (this.enteredTags.indexOf(tag) < 0) {
      this.enteredTags.push(tag);
    }
  }

  removeEnteredTag(tag) {
    this.enteredTags = this.enteredTags.filter(t => t !== tag);
  }


  computeAutoTags() {
    const formValue = this.questionForm.value;

    const allTextValues: string[] = [formValue.questionText];
    formValue.answers.forEach(answer => allTextValues.push(answer.answerText));

    const wordString: string = allTextValues.join(" ");

    const matchingTags: string[] = [];
    this.tags.forEach(tag => {
      const patt = new RegExp('\\b(' + tag.replace("+", "\\+") + ')\\b', "ig");
      if (wordString.match(patt)) {
        matchingTags.push(tag);
      }
    });
    this.autoTags = matchingTags;
  }


  // Helper functions
  getQuestionFromFormValue(formValue: any): Question {
    let question: Question;

    question = new Question();
    question.questionText = formValue.questionText;
    question.answers = formValue.answers;
    question.categoryIds = (formValue.category) ? [formValue.category] : [];
    question.tags = [...this.autoTags, ...this.enteredTags];
    question.ordered = formValue.ordered;
    question.explanation = formValue.explanation;
    question.createdOn = new Date();

    return question;
  }

  toggleLoader(flag: boolean) {
    this.loaderBusy = flag;
  }

  onSubmit(): Question {
    // validations
    this.questionForm.updateValueAndValidity();
    if (this.questionForm.invalid) {
      return;
    }

    // get question object from the forms
    const question: Question = this.getQuestionFromFormValue(this.questionForm.value);

    question.status = QuestionStatus.PENDING;

    question.created_uid = this.user.userId;

    return question;
  }


  filter(val: string): string[] {
    return this.tags.filter(option => new RegExp(this.utils.regExpEscape(`${val}`), 'gi').test(option));
  }

  saveQuestion(question: Question) {
    this.store.dispatch(new userActions.AddQuestion({ question: question }));
  }

}


