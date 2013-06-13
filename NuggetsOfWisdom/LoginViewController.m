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
    
    UIView* leftView1 = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, 20)];
    self.emailTextField.leftViewMode = UITextFieldViewModeAlways;
    self.emailTextField.leftView = leftView1;
    
    self.passwordTextField.backgroundColor = [UIColor whiteColor];
    self.passwordTextField.font = [UIFont fontWithName:fontName size:16.0f];
    self.passwordTextField.secureTextEntry = YES;
    
    UIView* leftView2 = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, 20)];
    self.passwordTextField.leftViewMode = UITextFieldViewModeAlways;
    self.passwordTextField.leftView = leftView2;
    
    [self.emailTextField becomeFirstResponder];
}

- (void)handleUserLogin:(PFUser *)user error:(NSError *)error {
    NSString *alertTitle, *alertMessage;
    if (user)
    {
        alertTitle = @"Woot!";
        alertMessage = @"User logged in!";
    }
    else
    {
        alertTitle = @"Email or password invalid";
        alertMessage = @"The email or password you provided does not appear to be valid.  Please check that you entered them correctly.";
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

- (IBAction)loginButtonClicked:(id)sender
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
    return;
}

- (IBAction)goToRegisterPage:(id)sender
{
    [self performSegueWithIdentifier:@"toRegisterPage" sender:self];
}

- (IBAction)forgotPassword:(id)sender
{
}

- (IBAction)cancelButtonClicked:(id)sender
{
    [self dismissViewControllerAnimated:YES completion:nil];
}

@end
