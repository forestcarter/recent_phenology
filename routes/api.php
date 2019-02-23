<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('getvalues', function(Request $request) {
    $lat =  $request->lat;
    $lng =  $request->lng;
    $date = new DateTime();
    $valuearray=[];
    for ($i=0; $i < 30; $i++) { 
      $date->modify("-1 day");
      $doy = $date->format('z');
      $missing = 3 - strlen("{$doy}");
      $missing == 1 && $doy="0".$doy;
      $missing == 2 && $doy="00".$doy;

      $year = $date->format('Y');
      $displaydate = $date->format('m-d');

      $yeardoy="{$year}{$doy}";
      $currentarray = array("date"=>$displaydate);

      //$yeardoy="2019028";
      if (DB::select("SELECT to_regclass('public.{$yeardoy}')")[0]->to_regclass == null){
        $currentarray['NDVI']=null;
      }else{
        $sql="SELECT ST_Value(rast, foo.pt_geom) AS rastval FROM \"{$yeardoy}\" CROSS JOIN (SELECT ST_SetSRID(ST_MakePoint({$lng},{$lat}), 4326) AS pt_geom) AS foo
        where st_intersects(rast,foo.pt_geom)";
        $result = DB::select($sql,[]); 
        if (sizeof($result)>0 && $result[0]->rastval>-2000){
          $currentarray['NDVI']=$result[0]->rastval;
        }
      }
      
      


      $valuearray[]=$currentarray;
      //$result = gregoriantojd( $date->format('m'), $date->format('d') , $date->format('Y') );
    }






    $finalresult=json_encode($valuearray);
    return $finalresult;
});







Route::post('tester8', function(Request $request) {
    $layer=[];
    $table =  $request->table;
    $obstype =  $request->obstype;
    //$table="linea_mtp";
    // If the Content-Type and Accept headers are set to 'application/json', 
    // this will return a JSON structure. This will be cleaned up later.
    $sql="SELECT iden, ST_AsGeoJSON(geom, 5) AS geojson FROM {$table}";
    $result = DB::select($sql,[]);
    $features=[];
    foreach($result AS $row) {
        unset($row->geom);
        $geometry=$row->geojson=json_decode($row->geojson);
        unset($row->geojson);
        //$pointtable='punto_ave';
        //$sql = "SELECT {$pointtable}.iden FROM ointtable} WHERE ST_Intersects({$pointtable}.geom,  ST_GeomFromText('POINT({$mylng} {$mylat})',4326))";
        //$result = DB::select($sql, []);

        $row->$obstype='oktest';
        $feature=["type"=>"Feature", "geometry"=>$geometry, "properties"=>$row];
        array_push($features, $feature);
        
    }
    $featureCollection=["type"=>"FeatureCollection", "features"=>$features];
    $layer['geom']=$featureCollection;
    //$geojson= json_encode($featureCollection);
    $geojson=json_encode($layer);
    return $geojson;

});


Route::post('getudp', function(Request $request) {
    $lineamtp = $request->lineamtp;
    $medicion = $request->medicion;
    $observacion = $request->observacion;
    $punto = $request->punto;
    $transecto = $request->transecto;
    $useremail = $request->useremail;
    $lifeform=explode('_',$observacion)[1];

    //get linea ID
    $sql = "SELECT iden FROM linea_mtp WHERE nombre_iden=:lineamtp";
    $result = DB::select($sql, [':lineamtp'=>$lineamtp]);
    $lineanumber=$result[0]->iden;
    //get medicion ID
    $sql = "SELECT iden FROM medicion WHERE iden_linea_mtp=:lineanumber and iden_nombre=:medicion";
    $result = DB::select($sql, [':lineanumber'=>$lineanumber,':medicion'=>$medicion]);
    $medicionnumber=$result[0]->iden;
    //get medicion ID
    $sql = "SELECT iden FROM medicion WHERE iden_linea_mtp=:lineanumber and iden_nombre=:medicion";
    $result = DB::select($sql, [':lineanumber'=>$lineanumber,':medicion'=>$medicion]);
    $medicionnumber=$result[0]->iden;
    $locationinfo='non'; 
    $obresult=[];
    
    if ($lifeform=='ave' || $lifeform=='mamifero'){
        $sql = "SELECT * FROM punto_{$lifeform} WHERE iden_medicion=:medicionnumber and iden_sampling_unit=:punto and iden_email=:useremail";
        $result = DB::select($sql, [':medicionnumber'=>$medicionnumber,':punto'=>$punto,':useremail'=>$useremail]);
        if ($result){  
            $sql = "SELECT * FROM observacion_{$lifeform} JOIN especie_{$lifeform} ON observacion_{$lifeform}.iden_especie = especie_{$lifeform}.iden WHERE observacion_{$lifeform}.iden_punto=:punto and observacion_{$lifeform}.iden_email=:useremail";
            $obresult = DB::select($sql, [':punto'=>$result[0]->iden,':useremail'=>$useremail]);
        }
    }
    if ($lifeform=='hierba' || $lifeform=='herpetofauna'){
        $sql = "SELECT * FROM transecto_{$lifeform} WHERE iden_medicion=:medicionnumber and iden_sampling_unit=:transecto and iden_email=:useremail";
        $result = DB::select($sql, [':medicionnumber'=>$medicionnumber,':transecto'=>$transecto,':useremail'=>$useremail]);
        if ($result){ 
            $sql = "SELECT * FROM observacion_{$lifeform} JOIN especie_{$lifeform} ON observacion_{$lifeform}.iden_especie = especie_{$lifeform}.iden WHERE observacion_{$lifeform}.iden_transecto=:transecto and observacion_{$lifeform}.iden_email=:useremail";
            $obresult = DB::select($sql, [':transecto'=>$result[0]->iden,':useremail'=>$useremail]);
        }
    }
    if ($lifeform=='arbol' || $lifeform=='arbusto'){
        $sql = "SELECT * FROM punto_{$lifeform} WHERE iden_medicion=:medicionnumber and iden_sampling_unit=:transecto and iden_numero_punto62=:punto and iden_email=:useremail";
        $result = DB::select($sql, [':medicionnumber'=>$medicionnumber,':transecto'=>$transecto,':punto'=>$punto,':useremail'=>$useremail]);
        if ($result){ 
            $sql = "SELECT * FROM observacion_{$lifeform} JOIN especie_{$lifeform} ON observacion_{$lifeform}.iden_especie = especie_{$lifeform}.iden WHERE observacion_{$lifeform}.iden_punto=:punto and observacion_{$lifeform}.iden_email=:useremail";
            $obresult = DB::select($sql, [':punto'=>$result[0]->iden,':useremail'=>$useremail]);
        }
    }

    //$sql = "SELECT udp_puebla_4326.iden FROM udp_puebla_4326 WHERE ST_Intersects(udp_puebla_4326.geom,  ST_GeomFromText('POINT({$mylng} {$mylat})',4326))";
    //$result = DB::select($sql, []);
    //$result=[$lineamtp,$medicion,$observacion,$punto,$transecto];
    //return json_encode($request->lng);
    //return json_encode($result[0]->iden);
     
    $finalresults=[$result,$obresult];
    return json_encode($finalresults);
});



Route::post('getspecies', function(Request $request) {
    $lifeform = $request->lifeform;
    $idtype = $request->idtype;
    $idnumber= $request->idnumber;
    $useremail = $request->useremail;
    
    $adminsql = "SELECT administrador FROM usuario WHERE email=:useremail";
    $adminresult = DB::select($adminsql, [':useremail'=>$useremail]);
    $admin=$adminresult[0]->administrador;
    $useremailval=$useremail;
    if ($admin=="true"){
        $useremailval='%';
    }
    
    $transpunto='punto';
    if ($lifeform=='hierba'||$lifeform=='herpetofauna'){
        $transpunto='transecto';
    }
    $lifeform_riesgo=$lifeform;
    if ($lifeform=='hierba'||$lifeform=='arbol' ||$lifeform=='arbusto'){
        $lifeform_riesgo='planta';
    }
    $lineaextra='';
    if ($idtype=="linea_mtp"){
        $lineaextra="JOIN medicion ON {$transpunto}_{$lifeform}.iden_medicion = medicion.iden";
    }
    $arbolarbustoextra='';
    if ($lifeform=="arbusto" || $lifeform=="arbol" ){
        $arbolarbustoextra="AVG((observacion_{$lifeform}.dn)::real)*count(especie_{$lifeform}.cientifico) as dominancia,
        sum((observacion_{$lifeform}.distancia)::real) as distancia,
        count (DISTINCT(observacion_{$lifeform}.iden_punto)) as sitios,";
    }
    $hierbaextra='';
    if ($lifeform=="hierba"){
        $hierbaextra="SUM((observacion_hierba.i)::real) as sumi,
		SUM(1/(NULLIF(observacion_hierba.m::real,0))::real) as summ,";
    }
    $sql= "SELECT
        especie_{$lifeform}.comun,
        especie_{$lifeform}.cientifico,
        especie_{$lifeform}.invasor,
        riesgo_{$lifeform_riesgo}.categoria,
        riesgo_{$lifeform_riesgo}.distribution,
        riesgo_{$lifeform_riesgo}.subespecie,
        {$arbolarbustoextra}
        {$hierbaextra}
        count(especie_{$lifeform}.cientifico) AS total_cientifico
        FROM especie_{$lifeform}
            JOIN
        observacion_{$lifeform} ON especie_{$lifeform}.iden = observacion_{$lifeform}.iden_especie
            JOIN
            {$transpunto}_{$lifeform} ON observacion_{$lifeform}.iden_{$transpunto} = {$transpunto}_{$lifeform}.iden
            {$lineaextra}
            left JOIN
        riesgo_{$lifeform_riesgo} ON trim(lower(especie_{$lifeform}.cientifico)) = lower(CONCAT(trim(riesgo_{$lifeform_riesgo}.genero),' ',trim(riesgo_{$lifeform_riesgo}.especie)))
        where iden_{$idtype}={$idnumber} and observacion_{$lifeform}.iden_email like '{$useremailval}' and especie_{$lifeform}.cientifico!='0000' and especie_{$lifeform}.cientifico!='000' and especie_{$lifeform}.cientifico!='00'
        GROUP BY especie_{$lifeform}.comun,especie_{$lifeform}.cientifico,riesgo_{$lifeform_riesgo}.categoria, riesgo_{$lifeform_riesgo}.distribution,especie_{$lifeform}.invasor, riesgo_{$lifeform_riesgo}.subespecie";
 
    $obresult = DB::select($sql, []);

    $transpuntosql="SELECT
    observacion_{$lifeform}.iden_{$transpunto}
    FROM observacion_{$lifeform}
        JOIN
        {$transpunto}_{$lifeform} ON observacion_{$lifeform}.iden_{$transpunto} = {$transpunto}_{$lifeform}.iden
        {$lineaextra}
    where iden_{$idtype}={$idnumber} and observacion_{$lifeform}.iden_email like '%' and observacion_{$lifeform}.iden_especie!=1 
    GROUP BY observacion_{$lifeform}.iden_{$transpunto}
    ";
    

    if ($lifeform=="arbusto" || $lifeform=="arbol" ){
        $distsum=0;
        $numeroindiviudos=0;
        foreach ($obresult as $row){
            $numeroindiviudos+=$row->total_cientifico;
            $distsum+=$row->total_cientifico*$row->distancia;
        } 
        if ($numeroindiviudos>0){
            $sumivi=0;
            $distanciamedia=$distsum/$numeroindiviudos;
            
            $transpuntoresult = DB::select($transpuntosql, []);
            $pointtotal = sizeof($transpuntoresult);
            $sumdensidad=0;
            $sumfrequencia=0;
            $sumdominancia=0;
            foreach ($obresult as $row2){
                $row2->densidad= ($row2->total_cientifico)/($distanciamedia*$distanciamedia);
                $row2->frequencia= ($row2->sitios)/$pointtotal;
                $sumdensidad += ($row2->total_cientifico)/($distanciamedia*$distanciamedia);
                $sumfrequencia += ($row2->sitios)/$pointtotal;
                $sumdominancia += $row2->dominancia;
            } 
            foreach ($obresult as $row3){
                $row3->ivi= ($row3->densidad*100)/$sumdensidad+($row3->frequencia*100)/$sumfrequencia+($row3->dominancia*100)/$sumdominancia;
                $sumivi += $row3->ivi;
            } 
        }
    }

    if ($lifeform=="hierba"){
        $sumdelong=0;
        $numeroindiviudos=0;
        foreach ($obresult as $row){
            $numeroindiviudos+=$row->total_cientifico;
            $sumdelong+=$row->sumi;
        } 
        if ($numeroindiviudos>0){
            
            $transpuntoresult = DB::select($transpuntosql, []);
            $pointtotal = sizeof($transpuntoresult);
            $sumdensidad=0;
            $sumdominancia=0;
            $sumfrequencia=0;
            foreach ($obresult as $row2){
                $row2->densidad= ($row2->summ)*(10000*$sumdelong);
                $row2->dominancia= ($row2->sumi)/$sumdelong;
                $row2->sv= (($sumdelong-$row2->dominancia)/$sumdelong)*100;
                $row2->cv= (($row2->dominancia)/$sumdelong)*100;
                $row2->ponderacion= ($row2->summ)/($row2->total_cientifico);
                $row2->frequencia= ($row2->ponderacion)*$pointtotal;
                $sumdensidad += $row2->densidad;
                $sumdominancia += $row2->dominancia;
                $sumfrequencia += ($row2->frequencia);
                
            } 
            $sumivi=0;
            foreach ($obresult as $row3){
                $row3->ivi= ($row3->densidad*100)/$sumdensidad+($row3->frequencia*100)/$sumfrequencia+($row3->dominancia*100)/$sumdominancia;
                $sumivi += $row3->ivi;
                
            }
        }
    }
    foreach ($obresult as $row4){
        if (isset($sumivi)){
            $row4->ivi100= round( ($row4->ivi*100)/$sumivi,2);
            $row4->dominancia= round($row4->dominancia,2);
            $row4->densidad= round($row4->densidad,2);
            $row4->frequencia= round($row4->frequencia,2);
        }else{
            $row4->ivi100='';
        } 
        
    }
    
    return json_encode($obresult);
});