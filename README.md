# synology-spk-converter
##	Installation
-	Login to your synology station via sh using your admin account
-	change to sudo (sudo -i) - use admin password when requested
-	copy the 3 shell scripts to /usr/local/bin
-	use chmod to give permissions

##	Make a spk file from an installed package:
-	find the name of the installed package in /var/packages
-	change to a chared folder
-	run the shell script:
		inst2spk <name of the installed package>
-	a file with the name <name of the installed package>.spk is generated in the shared folder

##	Make a spk file from a folder structure
-	Create a folder structure as shown in the sample folder 'webradio'
-	insert your programs in the package folder (see the sample)
-	modify the file "start-stop-status" in the scripts folder accordingly
-	modify the file "INFO" accordingly. the spk-file will have the combination of the name of the fields "package" and "version" in this file
-	change to the folder where you have the file structure
-	run the shell script:
		dir2spk <name of the folder with the folder structure>
-	a spk file will be created

##	Make a folder structure from a spk file:
-	change to the folder where you have the spk -file
-	run the shell script:
		spk2dir <full name of the spk-file>
-	a folder structure will be created with the name of the filename of the spk-file
