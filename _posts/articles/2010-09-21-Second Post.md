---
layout: post
title: Cold backup restoration
categories: articles
excerpt: "Restoring Cold backup onto a different server."
tags: [restoration]
comments: true
share: false
---

This procedure will clone a database using a cold copy of the source database
files. If a cold backup of the database is available, restore it to the new
location and jump to step 2.

1). Identify and copy the database files
With the source database started, identify all of the database's files. The
following query will display all datafiles, tempfiles and redo logs:
{% highlight sql %}
    set lines 100 pages 999
    col name format a50
    select name, bytes
    from (select name, bytes
     from v$datafile
     union all
     select name, bytes
     from v$tempfile
     union all
     select lf.member "name", l.bytes
     from v$logfile lf
     , v$log l
     where lf.group# = l.group#) used
    , (select sum(bytes) as poo
     from dba_free_space) free
    /
{% endhighlight %}

Make sure that the clone databases file-system is large enough and has all
necessary directories. If the source database has a complex file structure, you
might want to consider modifying the above sql to produce a file copy script.

Stop the source database with:
{% highlight sql %}
shutdown immediate
{% endhighlight %}
Copy, scp or ftp the files from the source database/machine to the target. Do not
copy the control files across. Make sure that the files have the correct
permissions and ownership.

Start the source database up again
{% highlight sql %}
startup
{% endhighlight %}
2). Produce a pfile for the new database
This step assumes that you are using a spfile. If you are not, just copy the
existing pfile.

From sqlplus:
{% highlight sql %}
create pfile='init<new database sid>.ora' from spfile;
{% endhighlight %}
This will create a new pfile in the $ORACLE_HOME/dbs directory.
Once created, the new pfile will need to be edited. If the cloned database is to
have a new name, this will need to be changed, as will any paths. Review the
contents of the file and make alterations as necessary. Also think about
adjusting memory parameters. If you are cloning a production database onto a
slower development machine you might want to consider reducing some values.

Note. Pay particular attention to the control locations.

3). Create the clone controlfile
Create a control file for the new database. To do this, connect to the source
database and request a dump of the current control file. From sqlplus:
{% highlight sql %}
alter database backup controlfile to trace as '/home/oracle/cr_<new sid>.sql';
{% endhighlight %}
The file will require extensive editing before it can be used. Using your
favourite editor make the following alterations:

Remove all lines from the top of the file up to but not including the second
`'STARTUP MOUNT'` line (it's roughly halfway down the file).  
Remove any lines that start with `--`.  
Remove any lines that start with a `#`  
Remove any blank lines in the `'CREATE CONTROLFILE'` section.  
Remove the line `'RECOVER DATABASE USING BACKUP CONTROLFILE'`  

Move to the top of the file to the 'CREATE CONTROLFILE' line. The word 'REUSE'
needs to be changed to 'SET'. The database name needs setting to the new database
name (if it is being changed). Decide whether the database will be put into
archivelog mode or not.

If the file paths are being changed, alter the file to reflect the changes.
Here is an example of how the file would look for a small database called dg9a
which isn't in archivelog mode:
{% highlight sql %}
    STARTUP NOMOUNT
    CREATE CONTROLFILE SET DATABASE "DG9A" RESETLOGS FORCE LOGGING NOARCHIVELOG
     MAXLOGFILES 50
     MAXLOGMEMBERS 5
     MAXDATAFILES 100
     MAXINSTANCES 1
     MAXLOGHISTORY 453
    LOGFILE
     GROUP 1 '/u03/oradata/dg9a/redo01.log' SIZE 100M,
     GROUP 2 '/u03/oradata/dg9a/redo02.log' SIZE 100M,
     GROUP 3 '/u03/oradata/dg9a/redo03.log' SIZE 100M
    DATAFILE
     '/u03/oradata/dg9a/system01.dbf',
     '/u03/oradata/dg9a/undotbs01.dbf',
     '/u03/oradata/dg9a/cwmlite01.dbf',
     '/u03/oradata/dg9a/drsys01.dbf',
     '/u03/oradata/dg9a/example01.dbf',
     '/u03/oradata/dg9a/indx01.dbf',
     '/u03/oradata/dg9a/odm01.dbf',
     '/u03/oradata/dg9a/tools01.dbf',
     '/u03/oradata/dg9a/users01.dbf',
     '/u03/oradata/dg9a/xdb01.dbf',
     '/u03/oradata/dg9a/andy01.dbf',
     '/u03/oradata/dg9a/psstats01.dbf',
     '/u03/oradata/dg9a/planner01.dbf'
    CHARACTER SET WE8ISO8859P1
    ;
{% endhighlight %}
Start the database and open it with resetlogs.
{% highlight sql %}  
ALTER DATABASE OPEN RESETLOGS;
{% endhighlight %}  
Add temp tablespace.
{% highlight sql %}  
ALTER TABLESPACE TEMP ADD TEMPFILE '/u03/oradata/dg9a/temp01.dbf' SIZE 104857600 REUSE AUTOEXTEND OFF;
{% endhighlight %}
4). Add a new entry to oratab and source the environment
Edit the `/etc/oratab` (or `/opt/oracle/oratab`) and add an entry for the new
database.

Source the new environment with '. oraenv' and verify that it has worked by
issuing the following command:
{% highlight sql %}
echo $ORACLE_SID
{% endhighlight %}
If this doesn't output the new database sid go back and investigate.

5). Create the a password file
Use the following command to create a password file (add an appropriate password
to the end of it):  
{% highlight sh %}
orapwd file=${ORACLE_HOME}/dbs/orapw${ORACLE_SID} password=<your password>
{% endhighlight %}

6). Create the new control file(s)
Ok, now for the exciting bit! It is time to create the new controlfiles and open
the database:
{% highlight sh %}
    sqlplus "/ as sysdba"
    @/home/oracle/cr_<new database sid>
{% endhighlight %}
It is quite common to run into problems at this stage. Here are a couple of
common errors and solutions:
{% highlight sql %}
ORA-01113: file 1 needs media recovery
{% endhighlight %}
You probably forgot to stop the source database before copying the files. Go back
to step 1 and recopy the files.
{% highlight sql %}
    ORA-01503: CREATE CONTROLFILE failed
    ORA-00200: controlfile could not be created
    ORA-00202: controlfile: '/u03/oradata/dg9a/control01.ctl'
    ORA-27038: skgfrcre: file exists
{% endhighlight %}
Double check the pfile created in step 2. Make sure the control_files setting is
pointing at the correct location. If the control_file setting is ok, make sure
that the control files were not copied with the rest of the database files. If
they were, delete or rename them.

7). Perform a few checks
If the last step went smoothly, the database should be open. It is advisable to
perform a few checks at this point:
Check that the database has opened with:
{% highlight sql %}
select status from v$instance;
{% endhighlight %}
The status should be 'OPEN'

Make sure that the datafiles are all ok:
{% highlight sql %}
select distinct status from v$datafile;
{% endhighlight %}
It should return only ONLINE and SYSTEM.

Take a quick look at the alert log too.

8). Set the databases global name
The new database will still have the source databases global name. Run the
following to reset it:
{% highlight sql %}
alter database rename global_name to <new database sid>;
{% endhighlight %}
9). Create a spfile
From sqlplus:
{% highlight sql %}
create spfile from pfile;
{% endhighlight %}
10). Change the database ID
If RMAN is going to be used to back-up the database, the database ID must be
changed. If RMAN isn't going to be used, there is no harm in changing the ID
anyway - and it's a good practice to do so.

From sqlplus:
{% highlight sql %}
    shutdown immediate
    startup mount
    exit
{% endhighlight %}
From unix:
{% highlight sh %}
    nid target=/
{% endhighlight %}
NID will ask if you want to change the ID. Respond with 'Y'. Once it has
finished, start the database up again in sqlplus:
{% highlight sql %}
    shutdown immediate;
    startup mount;
    alter database open resetlogs;
{% endhighlight %}
11). Configure TNS
Add entries for new database in the listener.ora and tnsnames.ora as necessary.

12). Finished
That's it! :)