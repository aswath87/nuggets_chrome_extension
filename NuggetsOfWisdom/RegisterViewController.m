//
//  RegisterViewController.m
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/11/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import "RegisterViewController.h"
#import <Parse/Parse.h>

@interface RegisterViewController ()

@end

@implementation RegisterViewController

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
    
    self.nameTextField.backgroundColor = [UIColor whiteColor];
    self.nameTextField.font = [UIFont fontWithName:fontName size:16.0f];
    
    UIView* leftView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 5, 20)];
    self.nameTextField.leftViewMode = UITextFieldViewModeAlways;
    self.nameTextField.leftView = leftView;
    
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
}

- (void)viewDidAppear:(BOOL)animated
{
    [self.nameTextField becomeFirstResponder];
}

- (void)handleSignUp:(NSNumber *)result error:(NSError *)error
{
    if (!error)
    {
        [self dismissViewControllerAnimated:YES completion:nil];
    }
    else
    {
        NSString *alertMessage;
        if ([error code] == 202)
        {
            alertMessage = [NSString stringWithFormat:@"Looks like %@ is already registered.", self.emailTextField.text];
        }
        else
        {
            alertMessage = @"Sorry, something went wrong. Try again?";
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.spinner stopAnimating];
            UIAlertView *message = [[UIAlertView alloc] initWithTitle:@"Error"
                                                              message:alertMessage
                                                             delegate:nil
                                                    cancelButtonTitle:@"OK"
                                                    otherButtonTitles:nil];
            [message show];
        });
    }
}

- (void)attemptSignUp
{
    NSString *alertTitle, *alertMessage;
    if ([self.nameTextField.text length] == 0)
    {
        alertTitle = @"Name required";
        alertMessage = @"Please tell us your name!";
    }
    else if (![Utils isEmailValidWithString:self.emailTextField.text])
    {
        alertTitle = @"Email address invalid";
        alertMessage = @"The email you provided appears invalid.  Please check that you entered it correctly.";
    }
    else if ([self.passwordTextField.text length] < 6)
    {
        alertTitle = @"Password too short";
        alertMessage = @"Please use a password of at least 6 characters.";
    }
    else
    {
        PFUser *user = [PFUser user];
        user.username = self.emailTextField.text; // using email address as username
        user.password = self.passwordTextField.text;
        user.email = self.emailTextField.text;
        [user setObject:self.nameTextField.text forKey:@"displayname"];
        [self.spinner startAnimating];
        dispatch_queue_t downloadQueue = dispatch_queue_create("register_user", NULL);
        dispatch_async(downloadQueue, ^{
            [user signUpInBackgroundWithTarget:self
                                      selector:@selector(handleSignUp:error:)];
        });
        return;
    }
    UIAlertView *message = [[UIAlertView alloc] initWithTitle:alertTitle
                                                      message:alertMessage
                                                     delegate:nil
                                            cancelButtonTitle:@"OK"
                                            otherButtonTitles:nil];
    [message show];    
}

- (IBAction)registerButtonClicked:(id)sender
{
    [self attemptSignUp];
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [self attemptSignUp];
    return YES;
}

- (IBAction)goToLoginPage:(UIButton *)sender
{
    [self performSegueWithIdentifier:@"toLoginPage" sender:self]; 
}
- (IBAction)cancelButtonClicked:(id)sender
{
    [self dismissViewControllerAnimated:YES completion:nil];
}

@end
