import os
import subprocess
from datetime import datetime, timedelta
subtract=32
mytargetdate = datetime.today() - timedelta(days = subtract)
julday = str( (mytargetdate.toordinal() - 125) % 365 +1)
if len(julday)==1:
	julday="0"+julday
if len(julday)==2:
	julday="0"+julday

tablename=str(mytargetdate.year)+str(julday)
deletesql = "PGPASSWORD=pcsemarnat! psql -U root -d ndvidb2 -c 'drop table IF EXISTS \"{0}\"'".format(tablename)
print(deletesql)
suboutput = subprocess.call(deletesql,shell=True)
