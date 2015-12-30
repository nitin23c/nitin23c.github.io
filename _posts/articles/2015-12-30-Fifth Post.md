---
layout: post
title: Clone database using duplicate database
categories: articles
excerpt: "Clone database using duplicate database using rman backup."
tags: [Database Cloning]
comments: true
share: false
---

* Table of Contents
{:toc}


## Full RMAN Backup of database including controlfile and spfile. 

Connect to the source database via RMAN and start the backup.

{% highlight sql %}
export ORACLE_SID=test
rman target sys/test
{% endhighlight %}

You could use the below script to take backup.

{% highlight sql %}
RUN
{
  ALLOCATE CHANNEL ch1 TYPE DISK MAXPIECESIZE 10G;
  BACKUP FORMAT '/dump1/test/clondbbkp/%d_D_%T_%u_s%s_p%p' DATABASE
  CURRENT CONTROLFILE FORMAT '/dump1/test/clondbbkp/%d_C_%T_%u'
  SPFILE FORMAT '/dump1/test/clondbbkp/%d_S_%T_%u'
  PLUS ARCHIVELOG FORMAT '/dump1/test/clondbbkp/%d_A_%T_%u_s%s_p%p';
  RELEASE CHANNEL ch1;
}
{% endhighlight %}

---

## Create pfile and edit and add parameters

connect to source database and create pfile

{% highlight sh %}
create pfile='/u01/test/pfile_test.ora' from spfile;
{% endhighlight %}

Open and edit the pfile and alter and add below parameters.

{% highlight sh %}
*.audit_file_dest='/data1/app/oracle/admin/test/adump'
*.control_files='/data1/app/oracle/oradata/test/control01.ctl','/data1/app/oracle/oradata/test/control02.ctl'
*.db_create_file_dest='/data1/app/oracle/oradata'
*.db_create_online_log_dest_1='/data1/app/oracle/oradata'
*.db_create_online_log_dest_2='/log1/oradata'
*.db_name='test'
*.db_recovery_file_dest='/log1/recovery_area'
*.db_recovery_file_dest_size=42949672960
*.diagnostic_dest='/data1/app/oracle'
*.log_archive_format='%t_%s_%r.dbf'
*.db_file_name_convert =("/data1/oradata/test/datafile","/data1/app/oracle/oradata/test")
*.log_file_name_convert =("/data1/oradata/test/onlinelog","/log1/oradata/test","/log1/controlfile/test/onlinelog","/log1/oradata/test")
{% endhighlight %}

Since the directory structures are different in old and new servers we will be using `db_file_name_convert` and `log_file_name_convert`

---

## Transfer Backup files and pfile.

transfer the backup and pfile to the new server via `scp` or `sftp`.

---

## Start the new instance on the new server.

Create all the required directories , Start the database in nomount mode using the `pfile`.

{% highlight sh %}
[oracle@testhost]$ export ORACLE_SID=test
[oracle@testhost]$ export ORACLE_SID=test
[oracle@testhost]$ sqlplus / as sysdba
SQL*Plus: Release 11.2.0.3.0 Production on Wed Dec 30 07:25:05 2015
Copyright (c) 1982, 2011, Oracle.  All rights reserved.

Connected to:
Oracle Database 11g Enterprise Edition Release 11.2.0.3.0 - 64bit Production
With the Partitioning, OLAP, Data Mining and Real Application Testing options

SQL> startup nomount;
ORACLE instance started.

Total System Global Area                   803894883 bytes
Fixed Size                                   1298729 bytes
Variable Size                              218193840 bytes
Database Buffers                           583948798 bytes
Redo Buffers                                 2972364 bytes
SQL> 
{% endhighlight %}

---

## Connect RMAN and start cloning

Connect to RMAN and start duplicating database using backup.

{% highlight sh %}
export ORACLE_SID=test
rman auxiliary /
{% endhighlight %}

{% highlight sh %}
duplicate database to 'test' backup location '/backup/test'
{% endhighlight %}

---

## Register database to listener

{% highlight sh %}
[oracle@testhost]$ export ORACLE_SID=test
[oracle@testhost]$ export ORACLE_SID=test
[oracle@testhost]$ sqlplus / as sysdba
SQL*Plus: Release 11.2.0.3.0 Production on Wed Dec 30 07:25:05 2015
Copyright (c) 1982, 2011, Oracle.  All rights reserved.

Connected to:
Oracle Database 11g Enterprise Edition Release 11.2.0.3.0 - 64bit Production
With the Partitioning, OLAP, Data Mining and Real Application Testing options

SQL> alter system register;
system altered.
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