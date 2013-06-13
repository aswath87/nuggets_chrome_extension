//
//  LoginViewController.h
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/11/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface LoginViewController : UIViewController <UIAlertViewDelegate, UITextFieldDelegate>

@property (weak, nonatomic) IBOutlet UITextField *emailTextField;
@property (weak, nonatomic) IBOutlet UITextField *passwordTextField;
@property (weak, nonatomic) IBOutlet UIActivityIndicatorView *spinner;

@end
