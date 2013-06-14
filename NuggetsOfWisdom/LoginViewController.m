//
//  LoginViewController.m
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/11/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import "LoginViewController.h"
#import "Utils.h"
#import <Parse/Parse.h>

@interface LoginViewController ()

@end

@implementation LoginViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    NSString* fontName = @"Avenir-Book";
    
    self.emailTextField.backgroundColor = [UIColor whiteColor];
    self.emailTextField.font = [UIFont fontWithName:fontName size:16.0f];
    
    UIView* leftView1 = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 5, 20)];
    self.emailTextField.leftViewMode = UITextFieldViewModeAlways;
    self.emailTextField.leftView = leftView1;
    
    self.passwordTextField.backgroundColor = [UIColor whiteColor];
    self.passwordTextField.font = [UIFont fontWithName:fontName size:16.0f];
    self.passwordTextField.secureTextEntry = YES;
    self.passwordTextField.delegate = self;
    
    UIView* leftView2 = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 5, 20)];
    self.passwordTextField.leftViewMode = UITextFieldViewModeAlways;
    self.passwordTextField.leftView = leftView2;
    
    [self.emailTextField becomeFirstResponder];
}

- (void)viewDidAppear:(BOOL)animated
{
    [self.emailTextField becomeFirstResponder];
}


- (void)handleUserLogin:(PFUser *)user error:(NSError *)error
{
    if (user)
    {
        [self dismissViewControllerAnimated:YES completion:nil];
    }
    else
    {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.spinner stopAnimating];
            UIAlertView *message = [[UIAlertView alloc] initWithTitle:@"Email or password invalid"
                                                              message:@"The email or password you provided does not appear to be valid.  Please check that you entered them correctly."
                                                             delegate:nil
                                                    cancelButtonTitle:@"OK"
                                                    otherButtonTitles:nil];
            [message show];
        });
    }
}

- (void)attemptLogin
{
    if ([self.emailTextField.text length] == 0 || [self.passwordTextField.text length] == 0)
    {
        UIAlertView *message = [[UIAlertView alloc] initWithTitle:@"Incomplete entry"
                                                          message:@"Please provide both an email address and password to sign in."
                                                         delegate:nil
                                                cancelButtonTitle:@"OK"
                                                otherButtonTitles:nil];
        [message show];
    }
    else
    {
        [self.spinner startAnimating];
        dispatch_queue_t downloadQueue = dispatch_queue_create("login_user", NULL);
        dispatch_async(downloadQueue, ^{
            [PFUser logInWithUsernameInBackground:self.emailTextField.text
                                         password:self.passwordTextField.text
                                           target:self
                                         selector:@selector(handleUserLogin:error:)];
        });
    }
}

- (IBAction)loginButtonClicked:(id)sender
{
    [self attemptLogin];
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [self attemptLogin];
    return YES;
}

- (IBAction)goToRegisterPage:(id)sender
{
    [self performSegueWithIdentifier:@"toRegisterPage" sender:self];
}

- (void)handlePasswordReset:(BOOL)succeeded error:(NSError *)error {
    NSString *alertTitle, *alertMessage;
    if (succeeded && ![[error userInfo] objectForKey:@"error"])
    {
        alertTitle = @"Done";
        alertMessage = [NSString stringWithFormat:@"Instructions to reset your password were sent to %@", self.emailTextField.text];
    }
    else
    {
        alertTitle = @"Error";
        alertMessage = @"Sorry, but we were unable to request a password reset.";
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.spinner stopAnimating];
        UIAlertView *message = [[UIAlertView alloc] initWithTitle:alertTitle
                                                          message:alertMessage
                                                         delegate:nil
                                                cancelButtonTitle:@"OK"
                                                otherButtonTitles:nil];
        [message show];
    });
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    NSString *title = [alertView buttonTitleAtIndex:buttonIndex];
    if([title isEqualToString:@"Send"])
    {
        if (![Utils isEmailValidWithString:self.emailTextField.text])
        {
            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Email address invalid"
                                                            message:@"The email you provided appears invalid.  Please check that you entered it correctly."
                                                           delegate:nil
                                                  cancelButtonTitle:@"OK"
                                                  otherButtonTitles:nil];
            [alert show];
        }
        else
        {
            [self.spinner startAnimating];
            dispatch_queue_t downloadQueue = dispatch_queue_create("reset_password", NULL);
            dispatch_async(downloadQueue, ^{
                [PFUser requestPasswordResetForEmailInBackground:self.emailTextField.text
                                                          target:self
                                                        selector:@selector(handlePasswordReset:error:)];
            });
        }
    }
}

- (IBAction)forgotPassword:(id)sender
{
    if ([Utils isEmailValidWithString:self.emailTextField.text])
    {
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Request password reset"
                                                          message:[NSString stringWithFormat:@"Request a password reset for %@?", self.emailTextField.text]
                                                         delegate:self
                                                cancelButtonTitle:@"Cancel"
                                                otherButtonTitles:@"Send",nil];
        [alert show];
    }
    else
    {
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Email address invalid"
                                                        message:@"The email you provided appears invalid.  Please check that you entered it correctly."
                                                       delegate:nil
                                              cancelButtonTitle:@"OK"
                                              otherButtonTitles:nil];
        [alert show];
    }
}

- (IBAction)cancelButtonClicked:(id)sender
{
    [self dismissViewControllerAnimated:YES completion:nil];
}

@end
