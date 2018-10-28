angular.module('5mHope.controllers', [])

.constant('APP_CONSTANTS',
          {
          API_URL:'http://54.209.137.69:9002/api/',
          LOGIN_URL:'users/login',
          USERDETAILS_URL:'get-user-details?access_token=',
          ADDGROUP_URL:'groups?access_token=',
          MYGROUPS_URL:'get-user-groups?access_token=',
          ALLGROUPS_URL:'groups?access_token=',
          GROUPDETAILS_URL:'get-family?group=',
          PRAYERS_URL:'users/',
          FORGOTPASSWORD_URL:'forgot-password?email=',
          REGISTER_URL:'users',
          BECOMELEADER_URL:'leaderTypes',
          CHANGEPASSWORD_URL:'change-password?access_token=',
          NOTIFICATIONS_URL:'notifications?access_token=',
          INVITEUSER_URL:'invite-user?email=',
          JOINGROUP_URL:'sendNotificationToLeader?group=',
          SONGS_URL:'SongsOnlines?access_token=',
          SONGS1_URL:'SongsOnlines',
          DELETEGROUP_URL:'deletegroup/',
          GETSCRIPTUREBOOKS_URL:'getbible?p=',
          // CHANGEPASSWORD_URL:'change-password?password=',
          ADDPRAYER_URL:'prayerDialogues?access_token=',
          UPDATEDETAILS_URL:'updateUserDetails?access_token=',
          SETNOTIFICATIONSTATUS_URL :'accept-reject-notification?notification=',
          DETAILS_URL:'userDetails?access_token=',
          UPDATEPROFILEPIC_URL:'userDetails/'
          
          })

.controller('LoginCtrl', function($scope, $stateParams,$state,$http,APP_CONSTANTS,$ionicPopup)
            {
            
            $scope.val={};
            
            // Set the default value of inputType
            $scope.inputType = 'password';
            
            // Hide & show password function
            $scope.hideShowPassword = function(){
            if ($scope.inputType == 'password')
            $scope.inputType = 'text';
            else
            $scope.inputType = 'password';
            };
            
            $scope.getBase64Image = function(img){
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            }
            
            $scope.showPopup = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Log-In Error',
                                               template: 'Username/Password cannot be empty'
                                               });
            alertPopup.then(function(res) {
                            });
            }
            
            $scope.showPopup_invalid = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Log-In Error',
                                               template: 'Invalid Username/Password.Please Try Again'
                                               });
            alertPopup.then(function(res) {
                            $scope.val.email="";
                            $scope.val.password="";
                            
                            });
            }
            
            $scope.login = function()
            {
            //$state.go("app.home");
            
            if($scope.val.email==null || $scope.val.password==null)
            {
            
            $scope.showPopup();
            
            }
            else {
            
            var data={"username":$scope.val.email,"password":$scope.val.password}
            
            $http({
                  method : 'POST',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.LOGIN_URL,
                  headers : {'Content-Type': 'application/json'},
                  data: data
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var loginresponse=data;
                             var id=loginresponse.id;
                             var ttl=loginresponse.ttl;
                             var created=loginresponse.created;
                             var userId=loginresponse.userId;
                             
                             localStorage.setItem("id",id);
                             localStorage.setItem("ttl",ttl);
                             localStorage.setItem("created",created);
                             localStorage.setItem("userId",userId);
                             
                             $http({
                                   method : 'GET',
                                   url: APP_CONSTANTS.API_URL+APP_CONSTANTS.USERDETAILS_URL+id
                                   }).success(function(data,status)
                                              {
                                              console.log("USER RESPONSE :"+JSON.stringify(data));
                                              
                                              if(status==200)
                                              {
                                              var userdetailsresponse=data.data;
                                              var firstName=userdetailsresponse.firstName;
                                              var lastName=userdetailsresponse.lastName;
                                              var role=userdetailsresponse.role;
                                              var userDetailId=userdetailsresponse.id;
                                              
                                              
                                              localStorage.setItem("role",role);
                                              localStorage.setItem("userDetailId",userDetailId);
                                              
                                              /* if image from API
                                               localStorage.setItem("userProfilePic","");*/
                                              
                                              localStorage.setItem("userProfilePic","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAhbQAAIW0B3hkBNQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAArySURBVHja7Z1rbBTXFcedECLHSJAmEWkLJW0+9EOl0mcikRKUiKpt+qUSEhgCCbUdCgQhhIJTikXwrhdDqW2MAAMpr7AuCJtHIBDAxeyun4vBjt+v+Jn12nhth0LdBLw27jnVXWnqrO19zMw9d/Z++EkI27vnzv+3szP33rk3anR0NMpoLP5j8kxgHrACSAasQCFQCTQCnUAvcB8YAh4APUA9UAxcYn+TCawFXgW+ZcRjZYSwpwELWdA3WKijGtEFXAXSgEXADCmA/oE/DrzGQrgJeDUMfDLwvYuArcDLWJsUQLvgXwIyADfHwCdjADgMvCIFUCf0OUAK0EI49PFoABKB56UAwQc/l12EeQUM3t/XxHlgvhRg8uBfB64YIPTxuE5NBCrB4y2b08DBkxWBd/CzgGzgUQSFrwTPdi9GnADQ6GggCRiM0OCVfMUuFp+ICAGgoQuANhn8N/gM+KVhBYDGTQHMwIgMe1yGWQfXk4YSABr0AusxkyEHBvZwzjGEANCQxcBdGWrQ9AO/E1oA1osnwwwd/Lo0aTnGoFXwU4ETMkDVuAzECCEAFDqddXTI4NQF5zNMJy0AFDgbqJZhacZt4DmSAkBh3wVaZUiaU4fHmpQAaCUrjOpB+8/SBHPHynd3Vq1LzCzZYjlsT8/KsVtz8ooQ/Df+H/4Mfwd/F/+GcHvwgzabhADsO/82pQMEAXZa0q220vK6xvaunvs9/QOjoYB/i6+Br4WvSUyCajWuCcINP4ZdnHA/IEviTJ7N5g8dDmdVbaiBTwa+Nr4HvhehUcWpXARgc/Muc/+0x5tdF64Wl7k9/cNaBT8WfC98T3xvAhKc4CWAiXfj8Tu7zdV9T6/gx4LvjTUQkCBFVwGwi5LzoM7gkZOfFvIKfixYC4Gh7cW6CMAmavZz/K4fKK9paqUSvg+sCWvjKACOt7ygqQA4TMlGqng18tEneSW3qIXvA2vjPLsJR1ynaClAGs/T3La/HrdTDd8H1sj5q8CsiQA4W4VNWODSsLfX7qh2e/q81AXAGrFWziOIC1QVAOersSlL3My2l1TWUA/fB9bK+SyAU+6i1RQgkWeD3lxl+VyU8H1gzZwlSFJFAJy2zGaucmvMviPnHaIJgDVzFgBvS2epIQDvJ3VGWr9w3xVNAKyZwATY7LAEwKdXePdyLXsnpU208H1g7ZyPH96SzgtHAO4ze97dlFkiqgBYO4FuYmdIAlD49COpu7NtogqQuvsfNiKjhq+HIgCJeX3pWTnCCpC2/7SDiABXghKAyqcf2X0wN19UAUDeQirHEddcCEaA81QKzzx05rrAAlB6GsoakAC4pAmllTlEFiCDlgBef4+bkev1kwLoO3HEnwANUgDDCtAyoQC4vBm1KdBSANV5aSIBDksBDC9Ahl8B2CzfASmA4QVwK582VgrwMsWnYKQAmvCaPwG2SgEiRoA0fwIUSQEiRoCb/ycALntOdVlWKYBmnULTlAIsovokrBRAMxYqBUijWuieQ2fFFeBALmUBkpUCXKVY5JK45Lu1TW2dogpQ1dDqhjbcIyrADaUAXRSLzP3ELuxsIB+5F+1UF8G+/z8BcDMkigUu/9P2RtHD94FtISrBzCi2Ixa54t5PPuQwigDYFqICzIti26KRK+6j09eKjCIAtoWoACui2N545Io7e6ngplEEwLZQvROIYnvzSAEiUwBrFNslUwoQmQIURrGtUqUAkSlAJQpQLwWIWAEaUYAeKUDECtCJAjwgKcDlAqcUQHN6UYCH8gwQsQLcRwG+pFjc0ZNXCo0igDX3n1Q7goZQABfF4jb8Za9hegLNfzthIyrAAxSgiWJxsfGmHqMIgEvQExXAjQJUUJ20cPFacZno4V++7rxN9fjikvNRVJZ7H2+jhxvFFdWihl9Z39IZG292Ez6+NrKzgRSzgu5RXBt4MvDsFRtnukN8+5kzKMAp6vvkJFkO20UJvqu3z/vWmtRaQfYfOoQCJFMvFE6jXaIIkHPB5hQkfCQVBVgqQrGFZdX1IggQv35XhUACrEMBfipCsSKsFA4XfS7Oy8UHy3wU4CkRisat3MgvFb/zWIFA4WPm033TwjtEKNpZUd9E9+LP410SZ+oXSIBW8g+GjOXPJrozhU+dyy8TKHzknBCPho3hYV1zu5vgJhEjy1dZWgQT4AOlAL8XpfDEbQfJnQX2HTlfJFj4yB+UAkyjOi/A3xBmTVMbmX6BpnbXAOHn/ya6AJw5doGIG6I04L2tWQVUBNiYtL9YwE+/098KIZsFaoC3pLyugfveQKWVtYLd9/vY4k+An4vUiDdXWZpdvZ4HvMLv7usfWbF6e72A4SM/9ifAY0CfSA0x7TrObSXx9Kwcu6Dht0+0UORxwRoz7HBWVeodfp7jFm6hNyyoAHsnEmC+aA1alpDSAqGM6LYZlKv7X0viTB5Bw0d+Pdli0XWiNQqC0e1aoBzuQQUOv125Suh4AmyQAhhWgMRAlot/BvhaCmA4AXDzz2cC3TLGKgUwnABHhNw0SgqgGj8Ldtu4AimAYQQoCmXfwFekAIYR4I1Qt479WIRxAQjGq5cAFbXN7YKFnxfO3sE/ot7jFRuv71zBju47gwKFj7uXzw13+/ijlBuZsH6X7gtJ4IOrIl/5ByvA9yj3C5w6l6/7DKEtKX8XYSAIz1TfCVsAytvJLE1IaXV7+h7qP///8w4BBoO2BZJtoAJMAagtczJYVtnQzGs4OOvoBQfh8HGiSrRqAjAJfoiPa5P45MebXfbSyhreM4J27jlpYxdapGZOAz8JNNeABWASrON9y4crb7e5uu9RmROYX1RRteydFEp9A5uCyTRYAXDW0DUeDVvzXkYp3oNTfCjE7ekftubmFRMQIR8z0kwAJsEsPVcWW7l2R7W9hP/pXgARMJPZweYZtABMgoU4P1/TmT5wEM9ecgi5WCQHEXBm8qJQsgxJACZBgjZLwpg8Bz+66IDbO6+I4XMS4f1QcwxZACbBDjVv67ZnZNs63HcGjbI8nE4iZIWTYbgC4EVhTrgzezd9cKCgse2LXqMFr4MIF7GPhpsATIJooDSUBqzemO4UcQUwIiLg4+gx4eYXtgBMgueA8kCLf2tNag3eP0da8CqK0Ox7uJOEAIoNqIsmW+bl9AVbaaQHH6YIn6kVvqoCMAli/HUUwZX9wP6jHzu6evuGZOABiTDepBNc1XWGmpmpKgCT4ElcfsRXNC6b1tDS2SsDDhxXr+ehJd2K4wxeRfif4oJeauelugC+0cPYePOxPR+eLejuG3gkQw2N4lu1DctXWZrYaq5TtchKEwEQaMBjwEY9J2wakKHO7jubxz7OJYQAChHmAjUyzKDBBTB+oXU+mgvAJIgGMgH5dRAY+4Cn9MhGFwEUIvwG6JYBjwsem9/qmYmuAjAJngXOybC/wRk8NnrnobsAChESgH/L4AdwdtNKXjlwE4BJ8CJwDK92IzB4HO7OBr7PMwOuAihEmAPsBb6KgOC/BrKAH1A49iQEUIgwE9jBTotGPNXvBJ6ndMxJCaAQYQaQBHgMEDy2YQvwNMVjTVIAhQgxwAbAJWDwncB6ve7nDSmAQoQngIXsu5NqP8IwgEPdZuBVrFmEYyuEAGNkeBz4FZAB1HHuXcQ1Cg8Ai6ie4g0ngB8hngbeAFKAfI37Fr5kHTarqVzFR7wA44xCzgIWAHGABTgF4Hb0FQDuO4T7Ddxl/Q9D7N9d7Gf4O7gc/Ul2Ol/JzjjfNtqxQv4LONO92C8+/WMAAAAASUVORK5CYII=")
                                              
                                              
                                              
                                              if(localStorage.getItem("role")=="user")
                                              {
                                              $state.go("app.home");
                                              }
                                              else if(localStorage.getItem("role")=="leader")
                                              {
                                              $state.go("app.homeleader");
                                              
                                              }
                                              //  $state.go("app.home");
                                              
                                              }
                                              }).error(function(data,status)
                                                       {
                                                       if(status==401){
                                                       $state.go("app.userdetails");
                                                       }
                                                       })
                             .finally(function()
                                      {
                                      });
                             }
                             else {
                             $scope.showPopup_invalid();
                             
                             }
                             }).error(function(data,status)
                                      {
                                      $scope.showPopup_invalid();
                                      })
            .finally(function()
                     {
                     });
            
            }
            
            };
            
            })

.controller('RegisterCtrl', function($scope, $stateParams,$ionicPopup,$state,$http,APP_CONSTANTS)
            {
            
            $scope.val={};
            
            // Set the default value of inputType
            $scope.inputType = 'password';
            
            // Hide & show password function
            $scope.hideShowPassword = function(){
            if ($scope.inputType == 'password')
            $scope.inputType = 'text';
            else
            $scope.inputType = 'password';
            };
            
            $scope.showPopup = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Error',
                                               template: 'Username/Email/Password cannot be blank'
                                               });
            alertPopup.then(function(res) {
                            });
            }
            
            $scope.showPopup_invalid = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Error',
                                               template: 'Could not register.Please Try Again later'
                                               });
            alertPopup.then(function(res) {
                            $scope.val.username="";
                            $scope.val.email="";
                            $scope.val.password="";
                            $scope.val.passwordagain="";
                            
                            });
            }
            
            $scope.showPopup_success = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Success',
                                               template: 'You have registered successfully.Please check your mail to verify your EmailID'
                                               });
            alertPopup.then(function(res) {
                            $state.go('login');
                            
                            });
            }
            
            $scope.register = function()
            {
            
            if($scope.val.username==null || $scope.val.email==null || $scope.val.password==null || $scope.val.passwordagain==null)
            {
            
            $scope.showPopup();
            
            }
            else {
            
            var data={username: $scope.val.username, email: $scope.val.email, password: $scope.val.password}
            
            $http({
                  method : 'POST',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.REGISTER_URL,
                  headers : {'Content-Type': 'application/json'},
                  data: data
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var registerresponse=data;
                             $scope.showPopup_success();
                             }
                             else {
                             $scope.showPopup_invalid();
                             
                             }
                             }).error(function(data,status)
                                      {
                                      $scope.showPopup_invalid();
                                      })
            .finally(function()
                     {
                     });
            
            }
            
            };
            
            })

.controller('ForgotPasswordCtrl', function($scope, $stateParams,$ionicPopup,$http,APP_CONSTANTS)
            {
            $scope.val={};
            
            $scope.showPopup = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Error',
                                               template: 'Email cannot be empty'
                                               });
            alertPopup.then(function(res) {
                            });
            }
            
            $scope.showPopup_invalid = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Error',
                                               template: 'Invalid Email.Please Try Again'
                                               });
            alertPopup.then(function(res) {
                            $scope.val.email="";
                            
                            });
            }
            
            $scope.showPopup_success = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Success',
                                               template: 'Email has been sent to the '+$scope.val.email+" .Please check your mail to Reset Password"
                                               });
            alertPopup.then(function(res) {
                            $scope.val.email="";
                            
                            });
            }
            
            $scope.reset = function()
            {
            
            if($scope.val.email==null)
            {
            
            $scope.showPopup();
            
            }
            else {
            
            var data={"email":$scope.val.email}
            
            $http({
                  method : 'POST',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.FORGOTPASSWORD_URL+$scope.val.email,
                  headers : {'Content-Type': 'application/json'},
                  data: data
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var loginresponse=data;
                             $scope.showPopup_success();
                             }
                             else {
                             $scope.showPopup_invalid();
                             
                             }
                             }).error(function(data,status)
                                      {
                                      $scope.showPopup_invalid();
                                      })
            .finally(function()
                     {
                     });
            
            }
            
            };
            
            })

.controller("BrowseCtrl", function($scope,$timeout,$stateParams,$state,$ionicModal,AudioSvc,$ionicPlatform, $fileFactory,$window,$rootScope,$ionicLoading, $ionicScrollDelegate) {
            
            var interval=$stateParams.interval;
            var prayername=$stateParams.name;
            var scriptures=$stateParams.scriptures;
            var prayer=$stateParams.prayer;
            var id=$stateParams.id;
            
            console.log("Prayer Name :"+prayername);
            console.log("Prayer :"+prayer);
            
            var fs = new $fileFactory();
            
            $ionicModal.fromTemplateUrl('templates/player.html', {
                                        scope: $scope
                                        }).then(function(modal) {
                                                $scope.modal = modal;
                                                });
            
            $scope.hidePlayer = function() {
            $scope.modal.hide();
            };
            
            $scope.player = function() {
            
            $scope.modal.show();
            };
            
            $ionicPlatform.ready(function() {
                                 fs.getEntriesAtRoot().then(function(result) {
                                                            console.log(JSON.stringify(result));
                                                            
                                                            $scope.files = result;
                                                            }, function(error) {
                                                            console.error(error);
                                                            });
                                 
                                 $scope.getContents = function(path) {
                                 fs.getEntries(path).then(function(result) {
                                                          $scope.files = result;
                                                          $scope.files.unshift({name: "[parent]"});
                                                          fs.getParentDirectory(path).then(function(result) {
                                                                                           result.name = "[parent]";
                                                                                           $scope.files[0] = result;
                                                                                           });
                                                          });
                                 }
                                 
                                 $scope.toggle = function(text, timeout) {
                                 $scope.show(text);
                                 
                                 setTimeout(function() {
                                            $scope.hide();
                                            }, (timeout || 1000));
                                 };
                                 
                                 $scope.show = function(text) {
                                 $ionicLoading.show({
                                                    template: text
                                                    });
                                 };
                                 
                                 $scope.hide = function() {
                                 $ionicLoading.hide();
                                 };
                                 
                                 $scope.showSubDirs = function(file) {
                                 
                                 if (file.isDirectory || file.isUpNav) {
                                 if (file.isUpNav) {
                                 processFile(file.nativeURL.replace(file.actualName + '/', ''));
                                 } else {
                                 processFile(file.nativeURL);
                                 }
                                 } else {
                                 if (hasExtension(file.name)) {
                                 if (file.name.indexOf('.mp4') > 0) {
                                 // Stop the audio player before starting the video
                                 $scope.stopAudio();
                                 VideoPlayer.play(file.nativeURL);
                                 } else {
                                 fsResolver(file.nativeURL, function(fs) {
                                            //console.log('fs ', fs);
                                            // Play the selected file
                                            
                                            
                                            var playduration=parseInt(interval)*60*1000;
                                            
                                            console.log("Interval_"+playduration);
                                            
                                            
                                            var arr=[];
                                            if(localStorage.getItem("playlist") !== null && localStorage.getItem("playlist") !== "")
                                            {
                                            console.log("Playlisttttt"+localStorage.getItem("playlist"));
                                            
                                            arr=JSON.parse(localStorage.getItem("playlist"));
                                            
                                            }
                                            arr.push(file.nativeURL);
                                            
                                            localStorage.setItem("playlist",JSON.stringify(arr));
                                            
                                            
                                            
                                            AudioSvc.playAudio(file.nativeURL, function(a, b) {
                                                               console.log("Position_"+a);
                                                               
                                                               
                                                               $scope.position = Math.ceil(a / b * 100);
                                                               if (a < 0) {
                                                               $scope.resumeAudio()
                                                               //$scope.stopAudio();
                                                               }
                                                               $timeout(function()
                                                                        {
                                                                        $scope.stopAudio();
                                                                        }, playduration);
                                                               
                                                               
                                                               if (!$scope.$$phase) $scope.$apply();
                                                               });
                                            
                                            
                                            $scope.loaded = true;
                                            $scope.isPlaying = true;
                                            $scope.name = file.name;
                                            $scope.path = file.fullPath;
                                            
                                            $scope.prayername = prayername;
                                            $scope.prayer = prayer;
                                            
                                            
                                            // show the player
                                            $scope.player();
                                            
                                            $scope.pauseAudio = function() {
                                            AudioSvc.pauseAudio();
                                            $scope.isPlaying = false;
                                            if (!$scope.$$phase) $scope.$apply();
                                            };
                                            $scope.resumeAudio = function() {
                                            AudioSvc.resumeAudio();
                                            $scope.isPlaying = true;
                                            if (!$scope.$$phase) $scope.$apply();
                                            };
                                            $scope.stopAudio = function() {
                                            AudioSvc.stopAudio();
                                            $scope.loaded = false;
                                            $scope.isPlaying = false;
                                            //$state.go('app.prayers')
                                            $scope.hidePlayer();
                                            if (!$scope.$$phase) $scope.$apply();
                                            };
                                            
                                            });
                                 }
                                 } else {
                                 $scope.toggle('Oops! We cannot play this file :/', 3000);
                                 }
                                 
                                 }
                                 
                                 }
                                 
                                 function processFile(url) {
                                 fsResolver(url, function(fs) {
                                            //console.log(fs);
                                            var directoryReader = fs.createReader();
                                            
                                            directoryReader.readEntries(function(entries) {
                                                                        if (entries.length > 0) {
                                                                        var arr = [];
                                                                        // push the path to go one level up
                                                                        if (fs.fullPath !== '/') {
                                                                        arr.push({
                                                                                 id: 0,
                                                                                 name: '.. One level up',
                                                                                 actualName: fs.name,
                                                                                 isDirectory: false,
                                                                                 isUpNav: true,
                                                                                 nativeURL: fs.nativeURL,
                                                                                 fullPath: fs.fullPath
                                                                                 });
                                                                        }
                                                                        processEntries(entries, arr);
                                                                        $scope.$apply(function() {
                                                                                      $scope.files = arr;
                                                                                      });
                                                                        
                                                                        //$ionicScrollDelegate.scrollTop();
                                                                        } else {
                                                                        $scope.toggle(fs.name + ' folder is empty!', 2000);
                                                                        }
                                                                        },
                                                                        function(error) {
                                                                        console.log(error);
                                                                        });
                                            });
                                 }
                                 
                                 function fsResolver(url, callback) {
                                 $window.resolveLocalFileSystemURL(url, callback);
                                 }
                                 
                                 function hasExtension(fileName) {
                                 var exts = ['.mp3', '.m4a', '.ogg', '.mp4', '.aac'];
                                 return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
                                 }
                                 
                                 function processEntries(entries, arr) {
                                 
                                 for (var i = 0; i < entries.length; i++) {
                                 var e = entries[i];
                                 
                                 // do not push/show hidden files or folders
                                 if (e.name.indexOf('.') !== 0) {
                                 arr.push({
                                          id: i + 1,
                                          name: e.name,
                                          isUpNav: false,
                                          isDirectory: e.isDirectory,
                                          nativeURL: e.nativeURL,
                                          fullPath: e.fullPath
                                          });
                                 }
                                 }
                                 return arr;
                                 }
                                 
                                 });
            
            })



.controller('AppCtrl', function($scope, $ionicModal, $timeout,$window,$rootScope,$http,APP_CONSTANTS,$state,$ionicHistory) {
            
            $scope.$on('$ionicView.beforeEnter', function() {
                       $rootScope.viewColor = '#6c2a0c';
                       $scope.imgURI=localStorage.getItem("userProfilePic")
                       
                       });
            
            
            /* $http({
             method : 'GET',
             url: APP_CONSTANTS.API_URL+APP_CONSTANTS.USERDETAILS_URL+localStorage.getItem("id")
             }).success(function(data,status)
             {
             console.log("USER RESPONSE :"+JSON.stringify(data));
             
             if(status==200)
             {
             var userdetailsresponse=data.data;
             var firstName=userdetailsresponse.firstName;
             var lastName=userdetailsresponse.lastName;
             var role=userdetailsresponse.role;
             var userDetailId=userdetailsresponse.id;
             
             
             }
             }).error(function(data,status)
             {
             
             })
             .finally(function()
             {
             });
             */
            
            $scope.player = function() {
            $rootScope.player();
            }
            
            $scope.user=false;
            $scope.leader=false;
            
            if(localStorage.getItem("role")=="user")
            {
            $scope.user=true;
            $scope.leader=false;
            }
            else if(localStorage.getItem("role")=="leader")
            {
            $scope.leader=true;
            $scope.user=false;
            }
            
            $scope.logout = function()
            {
            $window.location.href = $state.href('login', {});
            // reload the page
            $window.location.reload();
            
            
            }
            
            
            
            })

.controller('HomeCtrl', function($scope, $stateParams,$http,APP_CONSTANTS,$state,$ionicLoading, $compile,$ionicPlatform)
            {
            
            $scope.groups=[];
            
            $ionicPlatform.ready(function()
                                 {
                                 
                                 $http({
                                       method : 'GET',
                                       url: APP_CONSTANTS.API_URL+APP_CONSTANTS.MYGROUPS_URL+localStorage.getItem("id")+ '&filter[order]=id%20DESC'
                                       })
                                 .success(function(data,status)
                                          {
                                          if(status==200)
                                          {
                                          var usergroupsresponse=data.data;
                                          
                                          
                                          for(var i=0;i<usergroupsresponse.length;i++)
                                          {
                                          
                                          $scope.groups.push({
                                                             city:usergroupsresponse[i].city,
                                                             lat:usergroupsresponse[i].latitude,
                                                             lng:usergroupsresponse[i].longitude,
                                                             index:2
                                                             })
                                          }
                                          
                                          initMap();
                                          
                                          }
                                          })
                                 .error(function(data,status)
                                        {
                                        console.log("Response :"+JSON.stringify(data));
                                        })
                                 .finally(function()
                                          {
                                          });
                                 
                                 })
            
            function initMap()
            {
            $scope.map = new google.maps.Map(document.getElementById('map'),
                                             {
                                             zoom: 5,
                                             center: { lat: parseInt($scope.groups[0].lat), lng: parseInt($scope.groups[0].lng)}
                                             });
            
            setMarkers($scope.map);
            
            }
            
            function setMarkers(map)
            {
            
            var image = {
            url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            size: new google.maps.Size(20, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 32)
            };
            var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
            };
            for (var i = 0; i < $scope.groups.length; i++) {
            var beach = $scope.groups[i];
            var marker = new google.maps.Marker({
                                                position: {lat: parseInt(beach.lat), lng: parseInt(beach.lng)},
                                                map: map,
                                                //icon: image,
                                                shape: shape,
                                                title: beach.city,
                                                zIndex: beach.index
                                                });
            }
            }
            
            })


.controller('MyGroupsCtrl', function($scope, $stateParams,$http,APP_CONSTANTS,$state)
            {
            $scope.groups=[];
            
            $http({
                  method : 'GET',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.MYGROUPS_URL+localStorage.getItem("id")+ '&filter[order]=id%20DESC'
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var usergroupsresponse=data.data;
                             
                             for(var i=0;i<usergroupsresponse.length;i++)
                             {
                             $scope.groups.push({
                                                id : usergroupsresponse[i].id,
                                                userId : usergroupsresponse[i].userId,
                                                name : usergroupsresponse[i].name,
                                                created : usergroupsresponse[i].created,
                                                
                                                })
                             }
                             
                             }
                             }).error(function(data,status)
                                      {
                                      console.log("Response :"+JSON.stringify(data));
                                      })
            .finally(function()
                     {
                     });
            
            
            $scope.getGroupDetails = function(id,group)
            {
            $state.go("app.groupdetails",{id:id,name:group.name})
            }
            
            
            })


.controller('GroupDetailsCtrl', function($scope, $stateParams,$http,APP_CONSTANTS,$state)
            {
            
            $scope.groupname=$stateParams.name;
            $scope.id=$stateParams.id;
            
            $scope.users=[];
            
            $scope.inviteuser = function(id)
            {
            $state.go("app.inviteuser",{id:id})
            }
            
            $http({
                  method : 'GET',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.GROUPDETAILS_URL+$stateParams.id+'&access_token='+localStorage.getItem("id")
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var groupinforesponse=data.data;
                             
                             for(var i=0;i<groupinforesponse.length;i++)
                             {
                             $scope.users.push({
                                               name : groupinforesponse[i].userDetails.firstName+" "+groupinforesponse[i].userDetails.lastName
                                               })
                             }
                             
                             }
                             }).error(function(data,status)
                                      {
                                      console.log("Response :"+JSON.stringify(data));
                                      })
            .finally(function()
                     {
                     });
            
            })

.controller('InviteUserCtrl', function($scope, $stateParams,$http,APP_CONSTANTS,$state,$ionicPopup)
            {
            var id=$stateParams.id;
            $scope.data={};
            
            $scope.showPopup = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Success',
                                               template: 'Your invitation has been sent successfully'
                                               });
            alertPopup.then(function(res) {
                            
                            $state.go('app.mygroups')
                            });
            }
            
            $scope.cancel = function()
            {
            $state.go('app.mygroups')
            
            }
            $scope.inviteuser = function()
            {
            $http({
                  method : 'GET',
                  url:APP_CONSTANTS.API_URL+APP_CONSTANTS.INVITEUSER_URL+$scope.data.email+'&groupId='+id+'&access_token=' +localStorage.getItem("id")
                  
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             $scope.showPopup();
                             }
                             }).error(function(data,status)
                                      {
                                      console.log("Response :"+JSON.stringify(data));
                                      })
            .finally(function()
                     {
                     });
            }
            })

.controller('AllGroupsCtrl', function($scope, $stateParams,$http,APP_CONSTANTS,$ionicPopup)
            {
            $scope.groups=[];
            
            $scope.showPopup = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Success',
                                               template: 'Your request sent to leader.'
                                               });
            alertPopup.then(function(res) {
                            
                            //$state.go('app.mygroups')
                            });
            }
            
            $scope.errorpopup = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Error',
                                               template: 'Your already are a member of this group.'
                                               });
            alertPopup.then(function(res) {
                            
                            //$state.go('app.mygroups')
                            });
            }
            
            $http({
                  method : 'GET',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.ALLGROUPS_URL+localStorage.getItem("id")
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var usergroupsresponse=data;
                             
                             console.log("Response :"+JSON.stringify(data));
                             
                             
                             for(var i=0;i<usergroupsresponse.length;i++)
                             {
                             $scope.groups.push({
                                                id : usergroupsresponse[i].id,
                                                userId : usergroupsresponse[i].userId,
                                                name : usergroupsresponse[i].name,
                                                created : usergroupsresponse[i].created,
                                                
                                                })
                             }
                             
                             }
                             }).error(function(data,status)
                                      {
                                      console.log("Response :"+JSON.stringify(data));
                                      })
            .finally(function()
                     {
                     });
            
            $scope.join = function(id,userId)
            {
            //alert("2424")
            $http({
                  method : 'GET',
                  url:APP_CONSTANTS.API_URL+APP_CONSTANTS.JOINGROUP_URL + id + '&user=' + userId + '&sentBy=' + localStorage.getItem("userId") + '&status=false&access_token=' + localStorage.getItem("id"),
                  }).success(function(data,status)
                             {
                             //console.log("st"+status);
                             //alert(status)
                             
                             if(status==200)
                             {
                             $scope.showPopup();
                             }
                             else {
                             
                             $scope.errorpopup();
                             
                             }
                             }).error(function(data,status)
                                      {
                                      console.log("Response :"+JSON.stringify(data));
                                      $scope.errorpopup();
                                      
                                      })
            .finally(function()
                     {
                     });
            }
            
            
            })

.controller('HomeLeaderCtrl', function($scope, $stateParams,$http,APP_CONSTANTS,$ionicPopup,$state,$window)
            {
            
            console.log("............"+localStorage.getItem("id"));
            
            $scope.groups=[];
            
            $http({
                  method : 'GET',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.ALLGROUPS_URL+localStorage.getItem("id")
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var usergroupsresponse=data;
                             
                             console.log("Response :"+JSON.stringify(data));
                             
                             
                             for(var i=0;i<usergroupsresponse.length;i++)
                             {
                             $scope.groups.push({
                                                id : usergroupsresponse[i].id,
                                                userId : usergroupsresponse[i].userId,
                                                name : usergroupsresponse[i].name,
                                                created : usergroupsresponse[i].created
                                                })
                             }
                             
                             }
                             }).error(function(data,status)
                                      {
                                      console.log("Response :"+JSON.stringify(data));
                                      })
            .finally(function()
                     {
                     });
            
            $scope.showPopup_success = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Success',
                                               template: 'Group has been removed successfully'
                                               });
            alertPopup.then(function(res) {
                            $window.location.reload(true)
                            });
            }
            
            $scope.showPopup_error = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Error',
                                               template: 'Unable to remove group, please contact administrator'
                                               });
            alertPopup.then(function(res) {
                            $window.location.reload(true)
                            });
            }
            
            
            $scope.deleteGroup = function(group)
            {
            
            $http({
                  method : 'DELETE',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.DELETEGROUP_URL+group.id+"/?access_token="+localStorage.getItem("id")
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             $scope.showPopup_success();
                             }
                             else {
                             $scope.showPopup_error();
                             }
                             }).error(function(data,status)
                                      {
                                      $scope.showPopup_error();
                                      
                                      })
            .finally(function()
                     {
                     });
            }
            
            $scope.editGroup = function(group)
            {
            }
            
            })

.controller('AddGroupCtrl', function($scope, $stateParams,$state,$http,APP_CONSTANTS,$ionicPopup)
            {
            
            $scope.showPopup_success = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Success',
                                               template: 'Group successfully added.'
                                               });
            alertPopup.then(function(res) {
                            });
            }
            
            $scope.val={};
            
            $scope.loc=false;
            
            $scope.show = function()
            {
            $scope.loc=true;
            
            $scope.city="";
            $scope.state="";
            $scope.country="";
            
            }
            
            
            
            $scope.addgroup = function() {
            alert("here");
            
            
            var data={
            "name":  $scope.val.groupname,
            "latitude": "37.926868",
            "longitude": "-78.024902",
            "city": $scope.val.city,
            "state": $scope.val.state,
            "country": $scope.val.country,
            "created": new Date(),
            "status": true,
            "zipcode" : $scope.val.zipcode,
            //"id": localStorage.getItem("id"),
            "userId": localStorage.getItem("userId"),
            "idInjection": "false",
            "forceId": "false"
            }
            console.log("Request :"+JSON.stringify(data));
            
            $http({
                  method : 'POST',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.ADDGROUP_URL+localStorage.getItem("id"),
                  headers : {'Content-Type': 'application/json'},
                  data: data
                  }).success(function(data,status)
                             {
                             console.log("Response :"+status);
                             if(status==200)
                             {
                             var loginresponse=data;
                             var id=loginresponse.id;
                             var ttl=loginresponse.ttl;
                             var created=loginresponse.created;
                             var userId=loginresponse.userId;
                             
                             localStorage.setItem("id",id);
                             localStorage.setItem("ttl",ttl);
                             localStorage.setItem("created",created);
                             localStorage.setItem("userId",userId);
                             $scope.showPopup_success();
                             $state.go("app.homeleader");
                             $http({
                                   method : 'GET',
                                   url: APP_CONSTANTS.API_URL+APP_CONSTANTS.USERDETAILS_URL+id
                                   }).success(function(data,status)
                                              {
                                              if(status==200)
                                              {
                                              var userdetailsresponse=data.data;
                                              var firstName=userdetailsresponse.firstName;
                                              var lastName=userdetailsresponse.lastName;
                                              var role=userdetailsresponse.role;
                                              
                                              localStorage.setItem("role",role);
                                              
                                              $state.go("app.homeleader");
                                              
                                              }
                                              }).error(function(data,status)
                                                       {
                                                       console.log("Response :"+JSON.stringify(data));
                                                       })
                             .finally(function()
                                      {
                                      });
                             
                             
                             
                             }
                             }).error(function(data,status)
                                      {
                                      console.log("Response :"+JSON.stringify(data));
                                      })
            .finally(function()
                     {
                     });
            }
            
            $scope.cancel = function()
            {
            $state.go("app.homeleader");
            }
            
            })
.controller('PrayerSongsCtrl', function($scope,$state,$http,APP_CONSTANTS,$stateParams,$rootScope,$ionicPlatform)
            {
            $scope.$on('$ionicView.beforeEnter', function() {
                       $rootScope.viewColor1 = '#6c2a0c';
                       });
            
            $scope.interval=$stateParams.interval;
            $scope.name=$stateParams.name;
            $scope.scriptures=$stateParams.scriptures;
            $scope.prayer=$stateParams.prayer;
            var id=$stateParams.id;
            
            $scope.options=[];
            
            var src;
            var srcarray = [];
            
            function plsuccess(data){
            //console.log("Data = "+JSON.stringify(data));
            src = data[0].exportedurl;
            src = src.replace("file://localhost/","/");
            src = decodeURI(src);
            //document.getElementById('playbtn').disabled = false;
            //document.getElementById('delbtn').disabled = false;
            //document.getElementById('delMbtn').disabled = false;
            console.log(src);
            var slen = data.length;
            console.log(slen);
            for(var i=0;i<slen;i++)
            {
            var fileurl = data[i].exportedurl;
            fileurl = fileurl.replace("file:///","/");
            fileurl = decodeURI(fileurl);
            srcarray.push(fileurl);
            }
            }
            
            function delSuccess(a)
            {
            console.log(JSON.stringify(a));
            }
            function delError(e)
            {
            console.log(JSON.stringify(e));
            }
            
            // onSuccess Callback
            //
            function onSuccess() {
            console.log("playAudio():Audio Success");
            }
            
            // onError Callback
            //
            function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
            }
            
            $scope.selectsong = function()
            {
            //alert("fdfg")
            // request read access to the external storage if we don't have it
            
            //cordova.plugins.diagnostic.getExternalStorageAuthorizationStatus(function (status) {
            //if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
            console.log("External storage use is authorized");
            
            console.log("id : "+id);
            console.log("name : "+$scope.name);
            console.log("interval : "+$scope.interval);
            console.log("scriptures : "+$scope.scriptures);
            console.log("prayer : "+$scope.prayer);
            
            $state.go("app.browse",{id:id,name:$scope.name,interval:$scope.interval,scriptures:$scope.scriptures,prayer:$scope.prayer})
            
            /* $ionicPlatform.ready(function()
             {
             
             window.plugins.iOSAudioPicker.getAudio(plsuccess,delError,'true','false');
             })*/
            }
            
            
            $http({
                  method : 'GET',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.SONGS_URL+localStorage.getItem("id")
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var userdetailsresponse=data.data;
                             
                             console.log("Resp :"+JSON.stringify(data));
                             
                             for(var i=0;i<data.length;i++)
                             {
                             console.log("Resp :"+data[i].name);
                             $scope.options.push({
                                                 id:data[i].id,
                                                 name:data[i].songName,
                                                 url:data[i].url
                                                 })
                             
                             }
                             
                             
                             
                             }
                             }).error(function(data,status)
                                      {
                                      })
            .finally(function()
                     {
                     });
            
            
            $scope.songs = function(prayer)
            {
            alert(prayer)
            }
            
            })


.controller('SongsCtrl', function($scope, $stateParams, $http, APP_CONSTANTS) {
            $scope.songs=[];
            
            $http({
                  method : 'GET',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.SONGS_URL+localStorage.getItem("id"),
                  
                  }).success(function(data,status)
                             {
                             console.log("data:"+JSON.stringify(data))
                             console.log("status:"+status)
                             
                             if(status==200)
                             {
                             var songsresponse = data;
                             for(var i=0;i<songsresponse.length;i++)
                             {
                             $scope.songs.push({
                                               id : songsresponse[i].id,
                                               userId : songsresponse[i].userId,
                                               name : songsresponse[i].albumName,
                                               image : songsresponse[i].image,
                                               artist : songsresponse[i].artistName,
                                               time : songsresponse[i].time,
                                               songName : songsresponse[i].songName,
                                               url : songsresponse[i].url
                                               })
                             }
                             
                             }
                             }).error(function(data,status)
                                      {
                                      if(status==401){
                                      alert(data.message);
                                      }
                                      })
            .finally(function()
                     {
                     });
            
            $scope.open = function(url)
            {
            
            $state.go("app.foreverdetails",{url:url})
            }
            })

.controller('ForeverDetailsCtrl', function($scope,$state,$http,APP_CONSTANTS,$stateParams)
            {
            var url =$stateParams.iframeURL;
            console.log("Frame :"+url)
            //$scope.link=url.replace("watch?v=", "v/");
            
            
            })



.controller('PrayersCtrl', function($scope,$state,$http,APP_CONSTANTS)
            {
            
            $scope.prayers=[]
            
            $scope.prayerSongs = function(prayer)
            {
            console.log("response123 :"+JSON.stringify(prayer));
            
            $state.go("app.prayersongs",{id:prayer.id,name:prayer.name,interval:prayer.interval,scriptures:prayer.scriptures,prayer:prayer.prayer})
            }
            
            
            $http({
                  method : 'GET',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.PRAYERS_URL+localStorage.getItem("userId")+'/prayerDialogues?access_token=' + localStorage.getItem("userId") + '&filter[order]=id%20DESC',
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var prayersresponse=data;
                             console.log("pp response :"+JSON.stringify(data));
                             
                             for(var i=0;i<prayersresponse.length;i++)
                             {
                             $scope.prayers.push({
                                                 id : prayersresponse[i].id,
                                                 userId : prayersresponse[i].userId,
                                                 name : prayersresponse[i].knowingGodMore,
                                                 created : prayersresponse[i].created,
                                                 interval : prayersresponse[i].minutes,
                                                 scriptures:prayersresponse[i].scriptures,
                                                 prayer:prayersresponse[i].godPrayer
                                                 
                                                 })
                             }
                             
                             }
                             }).error(function(data,status)
                                      {
                                      console.log("Response :"+JSON.stringify(data));
                                      })
            .finally(function()
                     {
                     });
            
            $scope.addPrayer = function()
            {
            $state.go("app.addprayer")
            }
            })


.controller('AddPrayerScriptures', function($scope,$state,$stateParams,$ionicPopup,$http,APP_CONSTANTS) {
            $scope.data = {};
            
            $scope.scriptures=$stateParams.scriptures;
            $scope.data.knowingGodMore=$stateParams.prayertopic;
            $scope.data.minutes=$stateParams.minutes;
            $scope.data.prayer=$stateParams.godPrayer;
            
            //alert($stateParams.scriptures)
            
            console.log("Scr :"+$stateParams.scriptures)
            
            $scope.loadfromonline = function()
            {
            $state.go("app.loadscriptures")
            
            }
            $scope.savePrayer = function()
            {
            
            
            var data={
            knowingGodMore: $scope.data.knowingGodMore,
            date: new Date(),
            minutes: $scope.data.minutes,
            scriptures: $scope.scriptures,
            godPrayer: $scope.data.godPrayer,
            created: new Date(),
            status: true,
            //id: localStorage.getItem("id"),
            userId: localStorage.getItem("userId"),
            "idInjection": "false",
            "forceId": "false"
            }
            
            console.log("PRAYER :"+JSON.stringify(data))
            
            $http({
                  method : 'POST',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.ADDPRAYER_URL+localStorage.getItem("id"),
                  headers : {'Content-Type': 'application/json'},
                  data:data
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             
                             var loginresponse=data;
                             console.log("PRAYER :"+JSON.stringify(data))
                             var alertPopup = $ionicPopup.alert({
                                                                title: 'Success',
                                                                template: 'Prayer Added successfully'
                                                                });
                             alertPopup.then(function(res) {
                                             location.reload();
                                             $state.go('app.prayers')
                                             
                                             });
                             }
                             else {
                             var loginresponse=data;
                             var alertPopup = $ionicPopup.alert({
                                                                title: 'Error',
                                                                template: 'Could Not Add Prayer.Contact Aadministarator'
                                                                });
                             alertPopup.then(function(res) {
                                             //$state.go('app.prayers')
                                             });
                             }
                             }).error(function(data,status)
                                      {
                                      var loginresponse=data;
                                      var alertPopup = $ionicPopup.alert({
                                                                         title: 'Error',
                                                                         template: 'Could Not Add Prayer.Contact Aadministarator'
                                                                         });
                                      alertPopup.then(function(res) {
                                                      //$state.go('app.prayers')
                                                      });          })
            .finally(function()
                     {
                     });
            
            }
            
            })



.controller('AddPrayerCtrl', function($scope,$state,$ionicPopup,$http,APP_CONSTANTS)
            {
            
            $scope.data={};
            
            $scope.loadfromonline = function()
            {
            $state.go("app.loadscriptures",{prayertopic:$scope.data.knowingGodMore,minutes:$scope.data.minutes,prayer:$scope.data.godPrayer})
            
            }
            })

.controller('LoadScripturesCtrl', function($scope,$state,$http,APP_CONSTANTS,$ionicLoading,$stateParams)
            {
            
            var prayertopic=$stateParams.prayertopic;
            var minutes=$stateParams.minutes;
            var prayer=$stateParams.prayer;
            
            console.log("prayertopic :"+prayertopic)
            
            $scope.booksList=[
                              { title: '1. Genesis', value: 'Genesis' },
                              { title: '2. Exodus', value: 'Exodus'},
                              { title: '3. Leviticus', value: 'Leviticus'},
                              { title: '4. Numbers', value: 'Numbers'},
                              { title: '5. Deuteronomy', value: 'Deuteronomy'},
                              { title: '6. Joshua', value: 'Joshua'},
                              { title: '7. Judges', value: 'Judges'},
                              { title: '8. Ruth', value: 'Ruth'},
                              { title: '9. 1 Samuel', value: '1Samuel'},
                              { title: '10. 2 Samuel', value: '2Samuel'},
                              { title: '11. 1 Kings', value: '1Kings'},
                              { title: '12. 2 Kings', value: '2Kings'},
                              { title: '13. 1 Chronicles', value: '1Chronicles'},
                              { title: '14. 2 Chronicles', value: '2Chronicles'},
                              { title: '15. Ezra', value: 'Ezra'},
                              { title: '16. Nehemiah', value: 'Nehemiah'},
                              { title: '17. Esther', value: 'Esther'},
                              { title: '18. Job', value: 'Job'},
                              { title: '19. Psalms', value: 'Psalms'},
                              { title: '20. Proverbs', value: 'Proverbs'},
                              { title: '21. Ecclesiastes', value: 'Ecclesiastes'},
                              { title: '22. Song of Solomon', value: 'Song of Solomon'},
                              { title: '23. Isaiah', value: 'Isaiah'},
                              { title: '24. Jeremiah', value: 'Jeremiah'},
                              { title: '25. Lamentations', value: 'Lamentations'},
                              { title: '26. Ezekiel', value: 'Ezekiel'},
                              { title: '27. Daniel', value: 'Daniel'},
                              { title: '28. Hosea', value: 'Hosea'},
                              { title: '29. Joel', value: 'Joel'},
                              { title: '30. Amos', value: 'Amos'},
                              { title: '31. Obadiah', value: 'Obadiah'},
                              { title: '32. Jonah', value: 'Jonah'},
                              { title: '33. Micah', value: 'Micah'},
                              { title: '34. Nahum', value: 'Nahum'},
                              { title: '35. Habakkuk', value: 'Habakkuk'},
                              { title: '36. Zephaniah', value: 'Zephaniah'},
                              { title: '37. Haggai', value: 'Haggai'},
                              { title: '38. Zechariah', value: 'Zechariah'},
                              { title: '39. Malachi', value: 'Malachi'},
                              { title: '1. Matthew', value: 'Matthew'},
                              { title: '2. Mark', value: 'Mark'},
                              { title: '3. Luke', value: 'Luke'},
                              { title: '4. John', value: 'John'},
                              { title: '5. Acts (of the Apostles)', value: 'Acts'},
                              { title: '6. Romans', value: 'Romans'},
                              { title: '7. 1 Corinthians', value: '1Corinthians'},
                              { title: '8. 2 Corinthians', value: '2Corinthians'},
                              { title: '9. Galatians', value: 'Galatians'},
                              { title: '10. Ephesians', value: 'Ephesians'},
                              { title: '11. Philippians', value: 'Philippians'},
                              { title: '12. Colossians', value: 'Colossians'},
                              { title: '13. 1 Thessalonians', value: '1Thessalonians'},
                              { title: '14. 2 Thessalonians', value: '2Thessalonians'},
                              { title: '15. 1 Timothy', value: '1Timothy'},
                              { title: '16. 2 Timothy', value: '2Timothy'},
                              { title: '17. Titus', value: 'Titus'},
                              { title: '18. Philemon', value: 'Philemon'},
                              { title: '19. Hebrews', value: 'Hebrews' },
                              { title: '20. James', value: 'James'},
                              { title: '21. 1 Peter', value: '1Peter'},
                              { title: '22. 2 Peter', value: '2Peter'},
                              { title: '23. 1 John', value: '1John'},
                              { title: '24. 2 John', value: '2John'},
                              { title: '25. 3 John', value: '3John'},
                              { title: '26. Jude', value: 'Jude'},
                              { title: '27. Revelation', value: 'Revelation'}
                              ]
            
            
            $scope.scriptures=[];
            var totalPassages=[];
            var groupsArray=[];
            var totalChapters=[];
            
            $scope.chapters=[];
            $scope.verses=[];
            
            
            $scope.selectedVerses = {};
            
            
            $scope.display=false;
            $scope.getValue = false;
            $scope.save = function(verse1)
            {
            angular.forEach($scope.selectedVerses, function (selected, verse) {
                            if (selected) {
                            $scope.getValue = true;
                            console.log("prayertopic :"+prayertopic)
                            
                            $state.go('app.addprayerscriptures',{scriptures:verse,prayertopic:prayertopic,minutes:minutes,prayer:prayer})
                            
                            }
                            });
            }
            
            $scope.getChapters = function(selected_id)
            {
            $scope.display=true;
            
            $ionicLoading.show({
                               template: '<ion-spinner icon="android">Loading..</ion-spinner><br>Loading...'
                               });
            
            $http({
                  method : 'GET',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.GETSCRIPTUREBOOKS_URL+selected_id+'&access_token=' +localStorage.getItem("id")
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var response=data.data;
                             var res1=response.replace("(","");
                             var res2=res1.replace(");","");
                             var c=JSON.parse(res2);
                             $scope.scriptures=c
                             
                             if (typeof c.book[1] !== "undefined") {
                             // var totalBooks = $.map(c.book, function (value, index) {
                             //     return [value];
                             // });
                             
                             // Converting object to array
                             var totalChapters = [];
                             var myObj = c.book;
                             
                             var keys = Object.keys(c.book);
                             var last = keys[keys.length - 1];
                             
                             for (var i in myObj) {
                             if (myObj.hasOwnProperty(i)) {
                             if (angular.isNumber(i)) {
                             totalChapters[i] = myObj[i];
                             } else {
                             totalChapters.push(myObj[i]);
                             $scope.chapters=totalChapters
                             }
                             }
                             
                             if (last == i) {
                             
                             }
                             }
                             
                             
                             // Converting object to array
                             var totalPassages = [];
                             var myObj1 = c.book[1].chapter;
                             
                             var keys1 = Object.keys(c.book[1].chapter);
                             var last1 = keys1[keys1.length - 1];
                             
                             for (var j in myObj1) {
                             if (myObj1.hasOwnProperty(j)) {
                             if (angular.isNumber(j)) {
                             totalPassages[j] = myObj1[j];
                             } else {
                             totalPassages.push(myObj1[j]);
                             }
                             }
                             
                             if (last1 == j) {
                             
                             let groupsArray = []
                             for (var k = 1; k < totalPassages.length; k++) {
                             let item = totalPassages[k];
                             
                             groupsArray.push(item['verse_nr'] + '. '+ item['verse'])
                             if (k == totalPassages.length - 1) {
                             $scope.verses=groupsArray;
                             
                             }
                             }
                             
                             //console.log("GroupsArray : "+JSON.stringify($scope.chapters))
                             
                             
                             
                             }
                             }
                             }
                             }
                             }).error(function(data,status)
                                      {
                                      $ionicLoading.hide();
                                      })
            .finally(function()
                     {
                     $ionicLoading.hide();
                     });
            
            
            }
            })


.controller('BecomeLeaderCtrl', function($scope,$state,$http,APP_CONSTANTS,$ionicPopup) {
            
            
            $scope.getType = function(type)
            {
            console.log("Index:"+type.name)
            
            }
            
            $scope.becomeleader123 = function()
            {
            //alert("rgr")
            $scope.showPopup();
            }
            
            
            
            $scope.showPopup = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Success',
                                               template: 'Your request has been sent successfully'
                                               });
            alertPopup.then(function(res) {
                            });
            }
            
            $scope.options=[];
            
            
            $http({
                  method : 'GET',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.BECOMELEADER_URL
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var userdetailsresponse=data.data;
                             
                             console.log("Resp :"+JSON.stringify(data));
                             
                             for(var i=0;i<data.length;i++)
                             {
                             console.log("Resp :"+data[i].name);
                             $scope.options.push({
                                                 id:data[i].id,
                                                 name:data[i].name
                                                 })
                             
                             }
                             
                             
                             
                             }
                             }).error(function(data,status)
                                      {
                                      })
            .finally(function()
                     {
                     });
            
            
            $scope.becomeleader = function()
            {
            }
            })

.controller('SettingsCtrl', function($scope,$state) {
            
            $scope.goto = function(process)
            {
            $state.go('app.'+process);
            }
            
            })

.controller('UpdateProfileCtrl', function($scope, $stateParams,$state,$http,APP_CONSTANTS,$ionicPopup) {
            
            $http({
                  method : 'GET',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.USERDETAILS_URL+localStorage.getItem("id"),
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var userdetails=data.data;
                             
                             $scope.data.firstname = userdetails.firstName,
                             $scope.data.lastname = userdetails.lastName,
                             $scope.data.address = userdetails.address,
                             $scope.data.state = userdetails.state,
                             $scope.data.zip = parseInt(userdetails.zip),
                             $scope.data.phone = parseInt(userdetails.phone)
                             
                             
                             }
                             }).error(function(data,status)
                                      {
                                      console.log("Response :"+JSON.stringify(data));
                                      })
            .finally(function()
                     {
                     });
            
            
            $scope.canceUpdatel= function() {
            $state.go('app.settings')
            }
            
            $scope.data = {};
            $scope.updateDetails = function(){
            var data={
            firstName: $scope.data.firstname,
            lastName: $scope.data.lastname,
            address: $scope.data.address,
            state: $scope.data.state,
            zip: $scope.data.zip,
            phone: $scope.data.phone,
            "idInjection": "false",
            "forceId": "false"
            }
            $http({
                  method : 'POST',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.UPDATEDETAILS_URL+localStorage.getItem("id")+'&firstName='+$scope.data.firstname+'&lastName='+$scope.data.lastname+'&address='+$scope.data.address+'&state='+$scope.data.state+'&zip='+$scope.data.zip+'&phone='+$scope.data.phone,
                  headers : {'Content-Type': 'application/json'},
                  data: data
                  
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var updatedetailsdata=data.data;
                             
                             $scope.showPopup();
                             $state.go('app.settings');
                             }
                             }).error(function(data,status)
                                      {
                                      if(status==401){
                                      alert(data.message);
                                      }
                                      })
            .finally(function()
                     {
                     });
            }
            $scope.showPopup = function(title,msg) {
            //alert("333")
            var alertPopup = $ionicPopup.alert({
                                               title: "Success",
                                               template: "Profile Updated successfully"
                                               });
            alertPopup.then(function(res) {
                            });
            }
            
            })

.controller('MusicSettingsCtrl', function($scope,$state) {
            
            $scope.items=[];
            if(localStorage.getItem("playlist") !== null && localStorage.getItem("playlist") !== "")
            {
            
            $scope.items=JSON.parse(localStorage.getItem("playlist"));
            
            }
            $scope.savePlaylist = function()
            {
            }
            })

.controller('ProfilepicCtrl', function ($scope,$state, $cordovaCamera, $ionicPlatform,$ionicActionSheet,$ionicPopup) {
            
            
            $scope.imgURI=localStorage.getItem("userProfilePic")
            
            
            $scope.showPopup = function(title,msg) {
            //alert("333")
            var alertPopup = $ionicPopup.alert({
                                               title: title,
                                               template: msg
                                               });
            alertPopup.then(function(res) {
                            });
            }
            $scope.choosePhoto = function(sourcetype) {
            
            //cordova.plugins.diagnostic.getExternalStorageAuthorizationStatus(function (status) {
            //if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
            
            $ionicPlatform.ready(function() {
                                 if(sourcetype === 0)
                                 {
                                 sourceType  = Camera.PictureSourceType.PHOTOLIBRARY;
                                 }else {
                                 if(sourcetype === 1)
                                 sourceType  = Camera.PictureSourceType.CAMERA;
                                 }
                                 var options = {
                                 quality: 75,
                                 destinationType: Camera.DestinationType.DATA_URL,
                                 sourceType: sourcetype,
                                 allowEdit: true,
                                 encodingType: Camera.EncodingType.PNG,
                                 targetWidth: 300,
                                 targetHeight: 300,
                                 correctOrientation:true,
                                 popoverOptions: CameraPopoverOptions,
                                 saveToPhotoAlbum: false
                                 };
                                 $cordovaCamera.getPicture(options).then(function (imageData)
                                                                         {
                                                                         $scope.imgURI = 'data:image/png;base64,' + imageData;
                                                                         localStorage.setItem("userProfilePic",$scope.imgURI);
                                                                         
                                                                         $http({
                                                                               method : 'PATCH',
                                                                               url: APP_CONSTANTS.API_URL+APP_CONSTANTS.UPDATEPROFILEPIC_URL+localStorage.getItem("userDetailId"),
                                                                               data: $scope.imgURI
                                                                               }).success(function(data,status)
                                                                                          {
                                                                                          console.log("USER RESPONSE :"+JSON.stringify(data));
                                                                                          
                                                                                          if(status==200)
                                                                                          {
                                                                                          $scope.showPopup("Success","Profile Pic Updated Successfully")
                                                                                          
                                                                                          }
                                                                                          else
                                                                                          {
                                                                                          $scope.showPopup("Error","Profile Pic Could Not be updated")
                                                                                          }
                                                                                          }).error(function(data,status)
                                                                                                   {
                                                                                                   $scope.showPopup("Error","Profile Pic Could Not be updated")
                                                                                                   
                                                                                                   })
                                                                         .finally(function()
                                                                                  {
                                                                                  });
                                                                         }, function (err) {
                                                                         alert(err);
                                                                         });
                                 });
            
            
            };
            
            $scope.triggerActionSheet = function() {
            
            // Show the action sheet
            var showActionSheet = $ionicActionSheet.show({
                                                         buttons: [
                                                                   { text: 'Choose Photo' },
                                                                   { text: 'Take Photo' }
                                                                   ],
                                                         destructiveText: 'Cancel',
                                                         titleText: 'Action Sheet',
                                                         cancelText: 'Cancel',
                                                         cancel: function() {
                                                         // add cancel code...
                                                         },
                                                         
                                                         buttonClicked: function(index) {
                                                         if(index === 0) {
                                                         $scope.choosePhoto(0);
                                                         }
                                                         
                                                         if(index === 1) {
                                                         $scope.choosePhoto(1);
                                                         }
                                                         return true;
                                                         },
                                                         
                                                         destructiveButtonClicked: function() {
                                                         // add delete code..
                                                         }
                                                         });
            };
            
            $scope.cancelPic=function()
            {
            $state.go('app.settings');
            }
            
            
            })


.controller('ChangePasswordCtrl', function($scope, $stateParams,$state,$http,APP_CONSTANTS,$ionicPopup) {
            
            $scope.showPopup = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'ChangePassword Error',
                                               template: 'Password cannot be empty'
                                               });
            alertPopup.then(function(res) {
                            });
            }
            
            $scope.showPopup_success = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Success',
                                               template: 'Your password changed successfully.'
                                               });
            alertPopup.then(function(res) {
                            $scope.logout();
                            
                            });
            }
            
            $scope.val={};
            
            $scope.changepswd = function(){
            if($scope.val.password==null || $scope.val.confirmation==null)
            {
            
            $scope.showPopup();
            
            }
            else {
            
            var data={password: $scope.val.password,  confirmation: $scope.val.confirmation}
            $http({
                  method : 'POST',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.CHANGEPASSWORD_URL+localStorage.getItem("id")+'&password='+$scope.val.password+'&confirmation='+$scope.val.confirmation,
                  headers : {'Content-Type': 'application/json'},
                  data: data
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var changepasswordresponse=data;
                             $scope.showPopup_success();
                             }
                             else {
                             }
                             }).error(function(data,status)
                                      {
                                      
                                      })
            .finally(function()
                     {
                     });
            
            }
            
            };
            
            })

.controller('NotificationsCtrl', function($scope, $stateParams, $http, APP_CONSTANTS,$ionicPopup,$state)
            {
            $scope.notifications = [];
            
            $scope.showPopup_success = function() {
            var alertPopup = $ionicPopup.alert({
                                               title: 'Success',
                                               template: 'Your request accepted successfully.'
                                               });
            alertPopup.then(function(res) {
                            $state.go('app.homeleader');
                            
                            });
            }
            
            
            var id=$stateParams.id;
            var userId=localStorage.getItem("id");
            
            $http({
                  method : 'GET',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.NOTIFICATIONS_URL+localStorage.getItem("id")+'&userId=' + localStorage.getItem("userId")+ '&sentBy=' + localStorage.getItem("userId")+ '&status=true' +'&filter[order]=userId%20DESC',
                  
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var notificationsresponse=data;
                             
                             
                             var myuserId =  localStorage.getItem("userId");
                             for(var i=0;i<notificationsresponse.length;i++)
                             {
                             
                             if(notificationsresponse[i].userId==myuserId){
                             $scope.notifications.push({
                                                       id : notificationsresponse[i].id,
                                                       sentby : notificationsresponse[i].sentBy,
                                                       status:notificationsresponse[i].status
                                                       })
                             }
                             
                             }
                             
                             }
                             }).error(function(data,status)
                                      {
                                      if(status==401){
                                      alert(data.message);
                                      }
                                      })
            .finally(function()
                     {
                     });
            
            
            
            $scope.accept = function(id,status){
            alert(id);
            var data = {
            notificationId: id,
            status: status
            }
            
            $http({
                  method : 'GET',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.SETNOTIFICATIONSTATUS_URL+data.notificationId + '&status=' + data.status,
                  
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var notification=data.data;
                             $scope.showPopup_success();
                             console.log("User : "+JSON.stringify(data));
                             }
                             }).error(function(data,status)
                                      {
                                      if(status==401){
                                      alert(data.message);
                                      }
                                      })
            .finally(function()
                     {
                     });
            };
            })

.controller('PlaylistsCtrl', function($scope) {
            $scope.playlists = [
                                { title: 'Reggae', id: 1 },
                                { title: 'Chill', id: 2 },
                                { title: 'Dubstep', id: 3 },
                                { title: 'Indie', id: 4 },
                                { title: 'Rap', id: 5 },
                                { title: 'Cowbell', id: 6 }
                                ];
            })

.controller('PlaylistCtrl', function($scope, $stateParams) {
            })

.controller('UserDetailsCtrl', function($scope, $stateParams, $http, APP_CONSTANTS,$ionicPopup,$state) {
            $scope.val = {};
            
            $scope.detailsAdd = function(){
            var data={
            firstName: $scope.val.Firstname,
            lastName: $scope.val.lastname,
            address: $scope.val.address,
            state: $scope.val.state,
            zip: $scope.val.zip,
            phone: $scope.val.phone,
            "idInjection": "false",
            "forceId": "false"
            }
            $http({
                  method : 'POST',
                  url: APP_CONSTANTS.API_URL+APP_CONSTANTS.DETAILS_URL+localStorage.getItem("id")+'&firstName='+$scope.val.Firstname+'&lastName='+$scope.val.lastname+'&address='+$scope.val.address+'&state='+$scope.val.state+'&zip='+$scope.val.zip+'&phone='+$scope.val.phone,
                  headers : {'Content-Type': 'application/json'},
                  data: data
                  
                  }).success(function(data,status)
                             {
                             if(status==200)
                             {
                             var detailsdata=data.data;
                             
                             $scope.showPopup();
                             $state.go('app.home');
                             }
                             }).error(function(data,status)
                                      {
                                      if(status==401){
                                      alert(data.message);
                                      }
                                      })
            .finally(function()
                     {
                     });
            }
            
            $scope.showPopup = function(title,msg) {
            
            var alertPopup = $ionicPopup.alert({
                                               title: "Success",
                                               template: "Details Added successfully"
                                               });
            alertPopup.then(function(res) {
                            });
            }
            
            });

