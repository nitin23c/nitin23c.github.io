---
layout: post
title: Cold backup restoration
categories: articles
excerpt: "Cold Backup restoration and applying of archive logs manually."
tags: [restoration]
comments: true
share: false
---

Recovering database on a different server using a cold backup and then applying archive
logs to recover it to the current situation

Scenario: 
1.You have Monday's cold backup.
2.After Monday all the archive logs were deleted till Monday.
3.On Wednesday the database crashed.
4.You have archive logs after the cold backup till Wednesday when the database crashed.

Recover Database till Wednesday on a different server with different directory tree.

---

For Above scenario we'll use following steps to recover.
POA :

1. First copy cold backup taken on Monday to new server.
2. Now edit the pfile for locations of control file and all the dump locations.
3. create spfile from newly edited pfile.
4. Startup mount your database.
5. Now since the server is different with different directory tree, we'll change the paths of all the datafiles and redo logs.
6. Now recover database using backup controlfile until cancel.
7. Open the database using resetlogs.

---

Step 1: Use `scp` or any media to transfer cold backup to new server.

Step 2: Edit pfile for location change according to new server directory tree.

Step 3: Create spfile from edited pfile.
{% highlight sql %}
create spfile from pfile='/home/oracle/test.ora'
{% endhighlight %}
Step 4: Start and mount the database.
{% highlight sql %}
Startup mount;
{% endhighlight %}
Step 5: change location for all datafiles tempfiles and logfiles
{% highlight sql %}
alter database rename file '<old location>' to '< new location>';
{% endhighlight %}
Step 6: Recover Database.
{% highlight sql %}
recover database using backup controlfile until cancel;
 {% endhighlight %}
 Above command will ask for options like auto etc, either you can select auto aur
manually drag archive log files for recover till last archive log.

Step 7: Open Database.
{% highlight sql %}
Alter database open resetlogs;
{% endhighlight %}