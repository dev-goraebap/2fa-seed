export enum OAuthProviders {
    KAKAO = 'kakao',
    GOOGLE = 'google',
    NAVER = 'naver',
    APPLE = 'apple'
}

export interface FirebaseRepository<T> {
    save(entity: T): Promise<void | T>;
    remove(entity: T): Promise<void>;
}