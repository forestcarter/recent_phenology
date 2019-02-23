#!/usr/bin/env python2
import os
import shlex
import subprocess
from datetime import datetime, timedelta
downloadbool=True
print (str(datetime.now()))

class Dldate:
    def __init__(self, subtract, julday, year):
        self.subtract = subtract
        self.julday = julday
        self.year = str(year)
        self.yearjul = str(year)+julday
        self.target = 'none'

minusarray = [2,9,16]
python_dir = os.path.dirname(os.path.realpath(__file__))
staticpath = os.path.join(python_dir,'static')
tilespath = os.path.join(python_dir,"..",'public','tiles4')
previoussuccess=-7

if os.path.isdir(tilespath):
    existingarray = os.listdir(os.path.join(tilespath))
    if len(existingarray)>0:
        existingarray.sort()
        mostrecentdate = existingarray[-1]
    else:
        mostrecentdate = '0000000'


### DOWNLOAD
credfile= open((os.path.join(python_dir,"cred")), "r")
credcontents=credfile.readlines()
credfile.close()
username =  credcontents[0].split('***')[1]
password =  credcontents[0].split('***')[2]
datearray=[]
for subtract in minusarray:
    mytargetdate = datetime.today() - timedelta(days = subtract)
    julday = str( (mytargetdate.toordinal() - 125) % 365 +1)
    if len(julday)==1:
        julday="0"+julday
    if len(julday)==2:
        julday="0"+julday
    datearray.append(Dldate(subtract,julday, mytargetdate.year))

if downloadbool:
    if os.path.isdir(staticpath):
        os.system("rm -rf {}".format(staticpath))
        print ('deleted static')
    os.system("mkdir {}".format(staticpath))
    datearray2=[]
    dlfailed = False

    for index,mydate in enumerate(datearray):
        totaltries=0
        trial=0
        success=False

        while (success==False and dlfailed==False):
            if totaltries>100 or (index==0 and int(mydate.yearjul[-7:]) < int(mostrecentdate[-7:])):
                dlfailed=True
                break
            print (str(datetime.now()))
            indexfile = os.path.join(staticpath,'{0}.html.tmp'.format(mydate.yearjul))                       
            zipdestination = os.path.join(staticpath,mydate.yearjul)
            url1= 'https://dds.cr.usgs.gov/highvolume/emodis_v6/CONUS6/expedited/AQUA/{0}/comp_{1}/'.format(mydate.year,mydate.julday)
            htmldl=['/usr/bin/wget', '-O', indexfile, '--no-proxy', '-t', '3', '-o', os.path.join(python_dir,'static','dlhtml.txt'), '--no-check-certificate', '-L', '--user='+username, '--password='+password, '--no-parent', '-A', 'US_eMAE_NDVI.'+mydate.year+'.*.QKM.*.zip',url1]
            print (htmldl) 
            subprocess.call(htmldl)
            
            openindexfile= open((indexfile), "r")
            textcontents=openindexfile.readlines()
            openindexfile.close()
            if len(textcontents)>2:
                print("date {0} set to true").format(mydate.yearjul)
            else:
                print("date {0} set to false").format(mydate.yearjul)

            for item in textcontents:
                if "NDVI" in item and "QKM" in item and not ".sum" in item:
                    endcarrot= item.index(">")
                    startcarrot = item.index("<",1)
                    target=item[endcarrot+1:startcarrot]
                    print ("target is ",target)
                    mydate.target = target
            url2 = "https://dds.cr.usgs.gov/highvolume/emodis_v6/CONUS6/expedited/AQUA/{0}/comp_{1}/{2}".format(mydate.year,mydate.julday,target)
            dllist =['/usr/bin/wget', '--no-proxy', '-t', '3', '-o', os.path.join(python_dir,'static','dldata.txt'), '-O', zipdestination+'.zip', '--no-check-certificate', '-L', '--user='+username, '--password='+password, url2]
            print(dllist)
            subprocess.call(dllist)
            print("startingunzip")
            unzipCommand = "/usr/bin/unzip {0}.zip -d {0}".format(zipdestination)
            print(unzipCommand)
            subprocess.call(shlex.split(unzipCommand))
            if (os.path.isdir(zipdestination)):
                datearray2.append(Dldate(mydate.subtract,mydate.julday, mydate.year))
                previoussuccess =  mydate.subtract
                break
            else:
                print(trial)
                trial=trial+1
                if trial>2:
                    trial=0
                    newsubtract= mydate.subtract+1
                    if ((newsubtract-previoussuccess)<7):
                        newsubtract=previoussuccess+7
                    newmydate = datetime.today() - timedelta(days = newsubtract)
                    newjulday = str( (newmydate.toordinal() - 125) % 365 +1)
                    if len(newjulday)==1:
                        newjulday="0"+newjulday
                    if len(newjulday)==2:
                        newjulday="0"+newjulday
                    print("real"+newjulday)
                    mydate= Dldate(newsubtract,newjulday, newmydate.year)
                    
### PROCESS
targetdatearray=datearray
if downloadbool:
    targetdatearray=datearray2

if len(targetdatearray)==len(minusarray):
  
    for (ind, mydate) in enumerate(targetdatearray):
        for item1 in os.listdir(os.path.join(staticpath,mydate.yearjul)):
            if 'QKM.VI_NDVI' in item1 and item1[-3:]=='tif':
                ndvi=os.path.join(staticpath,mydate.yearjul,item1)
            if 'QKM.VI_QUAL' in item1 and item1[-3:]=='tif':
                qual=os.path.join(staticpath,mydate.yearjul,item1)
      
        ndviwarp = os.path.join(staticpath, mydate.yearjul+"ndviwarp")
        qualwarp = os.path.join(staticpath, mydate.yearjul+"qualwarp")
        subprocess.call(['gdalwarp', "-s_srs", "EPSG:2163", "-t_srs", "EPSG:4326", "-of", "VRT", "-overwrite",ndvi, ndviwarp])
        subprocess.call(['gdalwarp', "-s_srs", "EPSG:2163", "-t_srs", "EPSG:4326", "-of", "VRT", "-overwrite",qual, qualwarp])

        

        if ind==0:
            firstndviwarp=ndviwarp
            firstqualwarp=qualwarp
            forsave = os.path.join(staticpath, mydate.yearjul+"forsave")
            subprocess.call(["python",os.path.join(python_dir,'gdal_calc.py'), "--type=Int32", "-A", firstndviwarp, "-B", firstqualwarp, "--outfile={0}".format(forsave), "--calc","-13000+13000*(B<1)+A*(B<1)", "--overwrite"])
            savetodb =("raster2pgsql -s 4326 -t auto -I -C -M -F {0} public.{1} | PGPASSWORD=pcsemarnat! psql -U root -d ndvidb2").format(forsave,mydate.yearjul)
            print(savetodb)
            try:
                suboutput = subprocess.check_output(savetodb,shell=True)
            except:
                pass
            myfirstyearjul = mydate.yearjul
        else:
            colorsfile = os.path.join(python_dir,"colors.txt")
            postqual = os.path.join(staticpath, mydate.yearjul+"postqual")
            postqualpostsea = os.path.join(staticpath, mydate.yearjul+"postqualpostsea")

            withcolor = os.path.join(staticpath, mydate.yearjul+"withcolor")
            
            outfolder=os.path.join(tilespath,str(mydate.yearjul)+"-"+str(myfirstyearjul))
            subprocess.call(["python", os.path.join(python_dir,'gdal_calc.py'), "--type=Int32", "-A", firstndviwarp, "-B", ndviwarp, "-C", firstqualwarp,"-D", qualwarp,"--outfile={0}".format(postqual), "--calc","-13000+13000*(C<1)*(D<1)+A*(C<1)*(D<1)-B*(C<1)*(D<1)", "--overwrite"])
            subprocess.call(["python", os.path.join(python_dir,'gdal_calc.py'), "--type=Int32", "-A", firstndviwarp, "-B", postqual,"--outfile={0}".format(postqualpostsea), "--calc","-13005+13005*(A>-2000)+B*(A>-2000)", "--overwrite"])

            subprocess.call(['gdaldem', "color-relief", "-of", "VRT",postqualpostsea, colorsfile, withcolor])
            if os.path.isdir(tilespath) and ind==1:
                os.system("rm -rf {}".format(tilespath))
                print ('deleted tilespath')
                os.system("mkdir {}".format(tilespath))
            subprocess.call(["python", os.path.join(python_dir,'gdal2tiles.py'), "-z", "1-4", withcolor, outfolder])
print (str(datetime.now()))
