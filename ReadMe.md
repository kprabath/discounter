This Applications is Wrritten from React Native 

To Run in an Android Device 

1)Go to the Project folder 

2)Open the CMD OR Powershell inside the project folder

3)Execute command npm i for node module installations

4)Execute comman npx  react-native run-android --variant=release


To Run in  an IOS device

1)Go to the Project folder 

2)Open the Bash inside the folder

3)Execute command npm i for node module and pod  installations

4)Execute pod install for Cocopod dependecies installations


5)open the workspace xcode file and run the project from the Xcode

6)When you are using pod install command make sure to remove generated resource files from the Build Phases by Going to the discounter(Project Name) target ->buildphases->copy bundle resources if not new react native auto link  will produce multiple resource files it will failed the project compilation

