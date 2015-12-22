---
layout: post
title: Installation and configuration Oracle 11g on Amazon EC2 instance.
categories: articles
excerpt: "Installation and configuration Oracle 11g on Amazon EC2 instance."
tags: [installation]
comments: true
share: false
---

* Table of Contents
{:toc}


## Login to EC2 instance

Use the private key to login to the instance , You can either use pageant to export the private key or you could expport the key from within the putty  
![](/attachments/putty.png?raw=true)
browse and select the key.

Once the key has been exported logon to the server and switch to root.

{% highlight sh %}
$ sudo su
{% endhighlight %}

---

## Download Oracle Installer media on server

Login to the oracle support portal and download the `wget.sh` for downloading the installer media.

edit the `wget.sh` file and insert your support id and password

You could also edit the `wget.sh` file to include only those `.zip` file which you would want for installation.

Here we would only be needing the first two files.

Here is a peak at the wget log file.

{% highlight sh %}
[oracle@test installer]$ tail wgetlog-12-22-15-07\:22.log
439900K .......... .......... .......... .......... .......... 73% 27.1M 25s
439950K .......... .......... .......... .......... .......... 73% 3.33M 25s
440000K .......... .......... .......... .......... .......... 73% 37.4M 25s
440050K .......... .......... .......... .......... .......... 73% 53.8M 25s
440100K .......... .......... .......... .......... .......... 73% 26.4M 25s
440150K .......... .......... .......... .......... .......... 73% 39.1M 25s
440200K .......... .......... .......... .......... .......... 73% 37.0M 25s
440250K .......... .......... .......... .......... .......... 73% 3.78M 25s
440300K .......... .......... .......... .......... .......... 73% 1005K 25s
2015-12-22 07:24:52 (7.90 MB/s) - `./p10404530_112030_Linux-x86-64_1of7.zip' saved [113915106/113915106]
{% endhighlight %}

**Pro-tip:** in-case you are not able to download using wget.sh because of certficate issues , you could use elinks and past the links from `wget.sh` file one by one and download
{: .notice}

---

## Installation of prerequisites on OS

Check and edit the `/etc/hosts` file so that it shows the hostname.

All the installation and configuration of pre-reqs was done using oracle yum repository.

Fetch Oracle repository file and place it in repo location of server.

{% highlight sh %}
$cd /etc/yum.repos.d/
$wget http://public-yum.oracle.com/public-yum-ol6.repo
$yum list
{% endhighlight %}

You may need to download and import the gpgkey before installation.

{% highlight sh %}
$rpm --import http://oss.oracle.com/ol6/RPM-GPG-KEY-oracle
$rpm -q gpg-pubkey-ec551f03-4c2d256a
{% endhighlight %}

Install and configure the OS using the oracle preinstall.

{% highlight sh %}
$yum install oracle-rdbms-server-11gR2-preinstall
{% endhighlight %}

You could verify the installation and configuration made by the above statement.  
{% highlight sh %}
$vi /etc/sysctl.conf
$vi /etc/security/limits.conf
{% endhighlight %}

The preinstall would also create oracle user and oinstall and dba groups.  

---

## Configure OS for Oracle installation

Since most of the configuration is done by the preinstall , this step includes only creation of required directory structure and editing oracle profile.

{% highlight sh %}
$mkdir -p /u01/app/oracle/product/11.2.0/db_1
$mkdir -p /u01/app/oracle/oraInventory
{% endhighlight %}

And .bash_profile

{% highlight sh %}
TMP=/tmp; export TMP
TMPDIR=$TMP; export TMPDIR

ORACLE_HOSTNAME=testhost; export ORACLE_HOSTNAME
ORACLE_BASE=/u01/app/oracle; export ORACLE_BASE
ORACLE_HOME=$ORACLE_BASE/product/11.2.0/db_1; export ORACLE_HOME
ORACLE_SID=test; export ORACLE_SID

PATH=/usr/sbin:$PATH; export PATH
PATH=$ORACLE_HOME/bin:$PATH; export PATH

LD_LIBRARY_PATH=$ORACLE_HOME/lib:/lib:/usr/lib; export LD_LIBRARY_PATH
CLASSPATH=$ORACLE_HOME/jlib:$ORACLE_HOME/rdbms/jlib; export CLASSPATH
{% endhighlight %}


---

## Oracle Software installation

We would be doing a silent install of oracle sw , so we would be requiring a response file.

Click [here](/attachments/db_install.rsp) to download the response file used for this installation.

{% highlight sh %}
[oracle@testhost database]$ ./runInstaller -silent -ignoreSysPrereqs -force -responseFile /u01/installer/database/db1.rsp
Starting Oracle Universal Installer...

Checking Temp space: must be greater than 120 MB.   Actual 91478 MB    Passed
Checking swap space: 0 MB available, 150 MB required.    Failed <<<<

>>> Ignoring required pre-requisite failures. Continuing...

Preparing to launch Oracle Universal Installer from /tmp/OraInstall2015-12-22_06-10-22AM. Please wait ...
You can find the log of this install session at:
 /u01/app/oraInventory/logs/installActions2015-12-22_06-10-22AM.log
The installation of Oracle Database 11g was successful.
Please check '/u01/app/oraInventory/logs/silentInstall2015-12-22_06-10-22AM.log' for more details.

As a root user, execute the following script(s):
        1. /u01/app/oraInventory/orainstRoot.sh
        2. /u01/app/oracle/product/11.2.0/db_1/root.sh
		
Successfully Setup Software.
{% endhighlight %}

Execute above mentioned scripts using root user.

---

## Configure listener

We would also have to configire listener

{% highlight sh %}
[oracle@testhost installer]$ netca -silent -responseFile /u01/app/oracle/product/11.2.0/db_1/assistants/netca/netca.rsp
Parsing command line arguments:
    Parameter "silent" = true
    Parameter "responsefile" = /u01/app/oracle/product/11.2.0/db_1/assistants/netca/netca.rsp
Done parsing command line arguments.
Oracle Net Services Configuration:
Profile configuration complete.
Oracle Net Listener Startup:
    Running Listener Control:
      /u01/app/oracle/product/11.2.0/db_1/bin/lsnrctl start LISTENER
    Listener Control complete.
    Listener started successfully.
Listener configuration complete.
Oracle Net Services configuration successful. The exit code is 0
{% endhighlight %}

---

## Create database

We can create the database using response file or an inline syntax which has all the required details.

{% highlight sh %}
[oracle@testhost installer]$  dbca -silent -createDatabase   -templateName General_Purpose.dbc   -gdbname test -sid test -responseFile NO_VALUE   -characterSet AL32UTF8   -sysPassword OraPasswd1   -systemPassword OraPasswd1   -automaticMemoryManagement true   -storageType FS
Copying database files
1% complete
3% complete
11% complete
18% complete
37% complete
Creating and starting Oracle instance
40% complete
45% complete
50% complete
55% complete
56% complete
60% complete
62% complete
Completing Database Creation
66% complete
70% complete
73% complete
85% complete
96% complete
100% complete
Look at the log file "/u01/app/oracle/cfgtoollogs/dbca/test/test.log" for further details.
{% endhighlight %}

---

## Connect and verify

You could connect and verify the database , configure the parameters further to your liking.

{% highlight sh %}
[oracle@testhost ~]$ export ORACLE_SID=test
[oracle@testhost ~]$ sqlplus / as sysdba

SQL*Plus: Release 11.2.0.3.0 Production on Tue Dec 22 08:46:47 2015
Copyright (c) 1982, 2011, Oracle.  All rights reserved.

Connected to:
Oracle Database 11g Enterprise Edition Release 11.2.0.3.0 - 64bit Production
With the Partitioning, OLAP, Data Mining and Real Application Testing options

SQL>
{% endhighlight %}

---