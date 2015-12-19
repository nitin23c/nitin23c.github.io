---
layout: post
title: Manual Recovery
categories: articles
excerpt: "Manual recovery of datafiles or whole tablespace except SYSTEM tablespace and its datafiles."
tags: [recovery]
comments: true
share: false
---

Scenario: One of the datafiles or a tablespace gets corrupted (except SYSTEM tablespace).

POA:

1. Take that datafile offline.  
1. If the whole tablespace is corrupted then , add a new datafile to that tablespace and take offline all other datafiles of that tablespace.  
1. Restore datafiles either using the last cold backup or create the corrupted datafiles.  
1. Recover datafiles.  

---

Here in we are creating a scenario where in a datafile is lost due to disk corruption or such other issues.
First I am creating a user and then I would create a table whose data would be in test tablespace.

Below snapshot shows it.
{% highlight sql %}
    SYS@oratest AS SYSDBA 07-DEC-10> conn test
    Enter password:
    Connected.
    TEST@oratest 07-DEC-10> create table test(no number);
    Table created.
    TEST@oratest 07-DEC-10> insert into test values(1);
    1 row created.
    TEST@oratest 07-DEC-10> /
    1 row created.
    TEST@oratest 07-DEC-10> /
    1 row created.
    .
    .
    .
    TEST@oratest 07-DEC-10> commit;
    Commit complete.
{% endhighlight %}
Now , I would delete the datafile which belongs to test tablespace.  
{% highlight sh %}
    [ora10g@mumvshsrv01 oratest]$ rm -rf test01.dbf
{% endhighlight %}
After deleting the datafile, I would try to access that table, and it would throw the error as below snapshot shows.  
{% highlight sql %}
    SQL> select count(*) from test.test;
    select count(*) from test.test
     *
    ERROR at line 1:
    ORA-01116: error in opening database file 5
    ORA-01110: data file 5: '/odata2/ora10g/oradata/oratest/test01.dbf'
    ORA-27041: unable to open file
    Linux-x86_64 Error: 2: No such file or directory
    Additional information: 3
{% endhighlight %}
If above error is shown while accessing any data which belongs to the corrupted datafile then , Take the datafile offline by issuing following command.  
{% highlight sql %}
    SQL> alter database datafile '/odata2/ora10g/oradata/oratest/test01.dbf' offline;
    Database altered.
{% endhighlight %}
Now here we have two options where in we could either copy the last coldbackup of datafile into the
original location of datafile currently curropt. Or we could create the datafile by issuing following command.
{% highlight sql %}
    SQL> alter database create datafile '/odata2/ora10g/oradata/oratest/test01.dbf';
    Database altered.
{% endhighlight %}
Now After restoration has been done of datafile we'll recover it to current time.
We will do it by issuing following command.
{% highlight sql %}
    SQL> recover datafile '/odata2/ora10g/oradata/oratest/test01.dbf';
    ORA-00279: change 607140 generated at 12/08/2010 11:30:47 needed for thread 1
    ORA-00289: suggestion : /odata2/ora10g/archive/oratest/1_2_737129053.dbf
    ORA-00280: change 607140 for thread 1 is in sequence #2
    Specify log: {<RET>=suggested | filename | AUTO | CANCEL}
    auto
    ORA-00279: change 610388 generated at 12/08/2010 12:41:12 needed for thread 1
    ORA-00289: suggestion : /odata2/ora10g/archive/oratest/1_3_737129053.dbf
    ORA-00280: change 610388 for thread 1 is in sequence #3
    ORA-00278: log file '/odata2/ora10g/archive/oratest/1_2_737129053.dbf' no
    longer needed for this recovery
    .
    .
    .
    .
    .
    .
    .
    .
    .
    .
    ORA-00279: change 636684 generated at 12/08/2010 12:45:52 needed for thread 1
    ORA-00289: suggestion : /odata2/ora10g/archive/oratest/1_20_737129053.dbf
    ORA-00280: change 636684 for thread 1 is in sequence #20
    ORA-00278: log file '/odata2/ora10g/archive/oratest/1_19_737129053.dbf' no
    longer needed for this recovery
    Log applied.
    Media recovery complete.
{% endhighlight %}
After successful recovery of datafile we would bring that datafile online.
We would do it by issuing following command.
{% highlight sql %}
    SQL> alter database datafile '/odata2/ora10g/oradata/oratest/test01.dbf' online;
    Database altered.
{% endhighlight %}
Following query shows recovered data which was created prior to corruption of datafile.
{% highlight sql %}
    SQL> select count(*) from test.test;
     COUNT(*)
    ----------
     67108864
{% endhighlight %}