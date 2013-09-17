//
//  NuggetsThirdViewController.m
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/8/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import "NuggetsThirdViewController.h"
#import "NuggetsTableViewCell.h"
#import "NuggetViewController.h"
#import <Parse/Parse.h>

@interface NuggetsThirdViewController ()

@end

@implementation NuggetsThirdViewController

- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    PFUser *currentUser = [PFUser currentUser];
    if (!currentUser)
    {
        [self performSegueWithIdentifier:@"goToRegister" sender: self];
    }
    else
    {
        self.navigationBar.title = [currentUser valueForKey:@"displayname"];
        [self loadNuggets];
    }
//    [self.refreshControl addTarget:self
//                            action:@selector(loadPlaces)
//                  forControlEvents:UIControlEventValueChanged];
}

- (void)loadNuggets
{
//    [self.refreshControl beginRefreshing];
    dispatch_queue_t loaderQ = dispatch_queue_create("loader", NULL);
    dispatch_async(loaderQ, ^{
        PFQuery *query = [PFQuery queryWithClassName:@"Nugget_User"];
        [query whereKey:@"user" equalTo:[PFUser currentUser]];
        [query orderByDescending:@"updatedAt"];
        [query includeKey:@"nugget"];
        NSArray *nugget_users = [query findObjects];
        dispatch_async(dispatch_get_main_queue(), ^{
            self.nuggets = [[NSMutableArray alloc] init];
            for (PFObject *nugget_user in nugget_users)
            {
                [self.nuggets addObject:[nugget_user objectForKey:@"nugget"]];
            }
            [self.tableView reloadData];
//            [self.refreshControl endRefreshing];
        });
    });
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (NSString *)nuggetForRow:(NSUInteger)row
{
    return self.nuggets[row][@"text"];
}

- (NSString *)nuggetSourceForRow:(NSUInteger)row
{
    return self.nuggets[row][@"source"];
}

- (NSString *)nuggetTagForRow:(NSUInteger)row
{
    return [self.nuggets[row][@"tags"] componentsJoinedByString:@", "];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.nuggets count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *CellIdentifier = @"NuggetCell";
    NuggetsTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil)
    {
        NSArray *nib = [[NSBundle mainBundle] loadNibNamed:@"NuggetCell" owner:self options:nil];
        cell = [nib objectAtIndex:0];
    }
    
    cell.nuggetSourceLabel.text = [self nuggetSourceForRow:indexPath.row];
    cell.nuggetLabel.text = [self nuggetForRow:indexPath.row];
    [cell.nuggetLabel sizeToFit];
    cell.nuggetTag.text = [self nuggetTagForRow:indexPath.row];
    
    return cell;
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    NSIndexPath *indexPath = [self.tableView indexPathForCell:sender];
    if ([[segue identifier] isEqualToString:@"toNuggetPage"]) {
        // Set the selected button in the new view
        [segue.destinationViewController setNugget:[self nuggetForRow:indexPath.row]];
        [segue.destinationViewController setNuggetSource:[self nuggetSourceForRow:indexPath.row]];
        [segue.destinationViewController setNuggetTags:[self nuggetTagForRow:indexPath.row]];
    }
}

- (void)logout
{
    [PFUser logOut];
    [self.tabBarController setSelectedIndex:3]; // go to Discover tab
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    NSString *title = [alertView buttonTitleAtIndex:buttonIndex];
    if([title isEqualToString:@"Logout"])
    {
        [self logout];
    }
}

- (IBAction)settingsButtonClicked:(id)sender
{
    UIAlertView *message = [[UIAlertView alloc] initWithTitle:@"Logout"
                                                      message:@"Are you sure you want to logout?"
                                                     delegate:self
                                            cancelButtonTitle:@"Cancel"
                                            otherButtonTitles:@"Logout",nil];
    [message show];
}

/*
// Override to support conditional editing of the table view.
- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the specified item to be editable.
    return YES;
}
*/

/*
// Override to support editing the table view.
- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        // Delete the row from the data source
        [tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
    }   
    else if (editingStyle == UITableViewCellEditingStyleInsert) {
        // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
    }   
}
*/

/*
// Override to support rearranging the table view.
- (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)fromIndexPath toIndexPath:(NSIndexPath *)toIndexPath
{
}
*/

/*
// Override to support conditional rearranging of the table view.
- (BOOL)tableView:(UITableView *)tableView canMoveRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the item to be re-orderable.
    return YES;
}
*/

#pragma mark - Table view delegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Navigation logic may go here. Create and push another view controller.
    /*
     <#DetailViewController#> *detailViewController = [[<#DetailViewController#> alloc] initWithNibName:@"<#Nib name#>" bundle:nil];
     // ...
     // Pass the selected object to the new view controller.
     [self.navigationController pushViewController:detailViewController animated:YES];
     */
}

@end
