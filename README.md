# Next.js with Firebase Authentication (Email/Password with NextAuth)

This project is a simple template for integrating **Next.js** with **Firebase Authentication** using **NextAuth.js** for user authentication. It focuses on email/password authentication, session management, email verification, and protecting routes that require user authentication.

---

## Features

- **Firebase Authentication (Email/Password)**: Sign up, login, and password reset using Firebase.
- **NextAuth.js Integration**: Manages sessions and user authentication state.
- **Protected Routes**: Ensures certain pages are accessible only to authenticated users.
- **Email Verification**: Users must verify their email before accessing protected routes.
- **Custom Forms**: Built with **React Hook Form** and **Zod** for validation and feedback using **React Toastify**.

---

## Authentication Flow

1. **Signup**: Users can register using their email and password. Upon successful signup, they will receive an email verification link. Until they verify their email, they cannot access protected routes.
   
2. **Login**: After email verification, users can log in with their credentials. If the credentials are valid, they will be redirected to the home page or a protected page.

3. **Password Reset**: If a user forgets their password, they can request a password reset link from the login page.

4. **Email Verification**: A user must verify their email by clicking the verification link sent by Firebase. Protected routes check if the user's email is verified before granting access.

---


## Contributing

1. **Fork** the repository, create a branch, and make your changes.
2. **Commit** your changes and write clear commit messages.
3. **Push** your branch to your fork and submit a **pull request**.

