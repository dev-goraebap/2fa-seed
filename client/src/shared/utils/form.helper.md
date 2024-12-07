# FormHelper 유틸 클래스
Reactive Forms Module 사용시 반복되는 로직을 최소화 하기 위한 헬퍼 클래스.


 ### 사용방법

1. 컴포넌트에 FormHelper 초기 설정 추가
 ```ts
@Component({
    selector: 'otp-verify-widget',
    // FormHelper 프로바이더 추가
    providers: [
        FormHelper
    ],
    templateUrl: './otp-verify.widget.primary.html',
})
export class OtpVerifyWidget {

    private readonly fb = inject(FormBuilder);

    // FormHelper 의존성 추가
    readonly formHelper: FormHelper = inject(FormHelper);

    readonly formGroup: FormGroup;

    constructor() {
        this.formGroup = this.fb.group({
            otp: this.fb.control('', [
                Validators.required,
                Validators.minLength(USER_RULES.otpCode.min),
                Validators.maxLength(USER_RULES.otpCode.max),
                Validators.pattern(USER_RULES.otpCode.regex),
            ]),
        });

        // 사용중인 FormGroup 등록
        this.formHelper.setFormGroup(this.formGroup);
    }
}
 ```

2. 에러 메시지 출력 로직 추가

```html
<form [formGroup]="formGroup" class="flex flex-col w-full p-4">
    <mat-form-field>
        <mat-label>OTP 코드</mat-label>
        <input matInput formControlName="otp" />
        
        @if (formHelper.hasError('otp', 'required')) {
        <mat-hint class="text-red-500">OTP 코드를 입력해주세요.</mat-hint>
        } @else if (formHelper.hasError('otp', 'minlength') || formHelper.hasError('otp', 'maxlength')) {
        <mat-hint class="text-red-500">{{userRules.otpCode.lengthErrMsg}}</mat-hint>
        }@else if (formHelper.hasError('otp', 'pattern')) {
        <mat-hint class="text-red-500">{{userRules.otpCode.regexErrMsg}}</mat-hint>
        }
    </mat-form-field>

    <button mat-flat-button>확인</button>
</form>
```
 