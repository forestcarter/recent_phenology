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

Route::post('getboundingfeatures', function(Request $request) {
    $result="There was an error";
    $north =  $request->north;
    $east =  $request->east;
    $south =  $request->south;
    $west =  $request->west;
    $udpiden = $request->udpiden;

    $totalsql = "SELECT ST_Area((select geom from udp_puebla_4326 where iden={$udpiden}))";
    $totalarea=DB::select($totalsql,[])[0]->st_area;
    //Bounding box and soils 
    $sql =   
      "SELECT distinct descripcio, color
      FROM usos_de_suelo4 
      where ST_Intersects(usos_de_suelo4.geom,                        
      ST_GeomFromText('POLYGON(({$east} {$north},{$east} {$south},{$west} {$south},{$west} {$north},{$east} {$north}))',4326))";
    //udp and soils 
    $sqludp =   
      "SELECT gid, descripcio, color, 2 as aislado, {$totalarea} as totalarea, false as ismulti
      FROM usos_de_suelo4 
      where ST_Intersects(usos_de_suelo4.geom,
      (select geom from udp_puebla_4326 where iden={$udpiden}))";
    //udp and water lines 
    $sqludplineaagua =   
      "SELECT gid, nombre 
      FROM agua_lineas 
      where ST_Intersects(agua_lineas.geom,
      (select geom from udp_puebla_4326 where iden={$udpiden}))";
      //udp and water points
    $sqludppuntoagua =   
      "SELECT gid, nombre 
      FROM agua_puntos 
      where ST_Intersects(agua_puntos.geom,
      (select geom from udp_puebla_4326 where iden={$udpiden}))";

      //udp and water poli
    $sqludppoliagua =   
    "SELECT gid, nombre 
    FROM agua_poligonos 
    where ST_Intersects(agua_poligonos.geom,
    (select geom from udp_puebla_4326 where iden={$udpiden}))";

    //which munis interect with udp
    $sqludpmuni =   
    "SELECT nomgeo 
    FROM municipio_puebla_4326 
    where ST_Intersects(ST_SetSRID(municipio_puebla_4326.geom, 4326),
    (select geom from udp_puebla_4326 where iden={$udpiden}))";
      
    if (is_numeric($north) && is_numeric($east) && is_numeric($south) && is_numeric($west)){
      $result = DB::select($sql,[]);
    }

    $resultudp = DB::select($sqludp,[]);

    $resultudplineaagua = DB::select($sqludplineaagua,[]);
    $resultudppuntoagua = DB::select($sqludppuntoagua,[]);
    $resultudppoliagua = DB::select($sqludppoliagua,[]);
    $resultudpmuni = DB::select($sqludpmuni,[]);

    

    //Get length of water lines
    $agualength =0;
    foreach($resultudplineaagua AS $row2) {
      $agualinegid = $row2->gid;
 
      //get length of water lines in udp
      $lengthsql="SELECT ST_Length(ST_INTERSECTION((select geom from agua_lineas where gid = ?), (select geom from  udp_puebla_4326 where iden=?)))";
      $lengthresult = DB::select($lengthsql,[$agualinegid,$udpiden]);
      $agualength= $agualength + (float)($lengthresult[0]->st_length);
    }
    $aguaarea = 0;
    foreach($resultudppoliagua AS $row3) {
      $aguapoligid = $row3->gid;
      //get length of water lines in udp
      $areasql="SELECT ST_Area(ST_INTERSECTION((select geom from agua_poligonos where gid = ?), (select geom from  udp_puebla_4326 where iden=?)))";
      $arearesult = DB::select($areasql,[$aguapoligid,$udpiden]);
      $aguaarea= $aguaarea + (float)($arearesult[0]->st_area);
    }

    $multisql =" SELECT (ST_DUMP(ST_INTERSECTION((select geom from usos_de_suelo4 where gid = ?), 
          (select geom from udp_puebla_4326 where iden=?)
          ))).geom::geometry(Polygon,4326)";

    $newrows=[];
    foreach($resultudp AS $row) {
      $gid = $row->gid;
      //If soil is completely within, within set to 1. Unassigned is 2
      $withinsql ="SELECT ST_Within(usos_de_suelo4.geom, (select geom from udp_puebla_4326 where iden=?)) from usos_de_suelo4 where gid = ?";
      $withinresult = DB::select($withinsql,[$udpiden,$gid]);
      if ($withinresult[0]->st_within){
        $row->aislado=1;
      }else{
        $row->aislado=0;
      }
      
      $multiresult = DB::select($multisql,[$gid,$udpiden]);
      foreach($multiresult AS $patchrow) {
        $areasql ="SELECT ST_Area(?)";
        $arearesult = DB::select($areasql,[$patchrow->geom]);
        $newrow = new stdClass();
        $newrow->area=(float)($arearesult[0]->st_area);
        
        $newrow->descripcio=$row->descripcio;
        $newrow->totalarea=$row->totalarea;
        $newrow->color=$row->color;
        $newrow->aislado=$row->aislado;
        //Aisilado for smallest subdivsions 
        // $withinsql2 ="SELECT ST_Within(?, (select geom from udp_puebla_4326 where iden=?))";
        // $withinresult2 = DB::select($withinsql2,[$patchrow->geom,$udpiden]);
        // if ($withinresult2[0]->st_within){
        //   $newrow->aislado=1;
        // }else{
        //   $newrow->aislado=0;
        // }

        //Data that free-rides on resultudp
        $newrow->agualength=$agualength;
        $newrow->aguacount=sizeof($resultudppuntoagua)/2;
        $newrow->aguaarea=$aguaarea;
        $newrow->munilist=$resultudpmuni;
        $newrows[]=$newrow;
      }
      //get area of usos de suelo
      // $areasql ="SELECT ST_Area(ST_INTERSECTION(usos_de_suelo4.geom, (select geom from udp_puebla_4326 where iden=?))) from usos_de_suelo4 where gid = ?";
      // $arearesult = DB::select($areasql,[$udpiden,$gid]);
      // $row->area=(float)($arearesult[0]->st_area);
      
     
      //Data that free-rides on resultudp
      // $row->agualength=$agualength;
      // $row->aguacount=sizeof($resultudppuntoagua)/2;
      // $row->aguaarea=$aguaarea;
      // $row->munilist=$resultudpmuni;


    }
    
    

/////////////AGUA///////////
    class layer
    {
        public $tableName;
        public $displayName;
        public $color;
        public $fillColor;
        public $opacity;
        public $weight;
        public $fillOpacity;
    }

    $layer2 = new layer();
    $layer2->tableName = 'agua_lineas';
    $layer2->displayName = 'Agua Lineas';
    $layer2->featureColumn = 'nombre';
    $layer2->color = 'blue';
    $layer2->fillColor = 'blue';
    $layer2->opacity = 1;
    $layer2->weight = 1;
    $layer2->fillOpacity = 1;
    $layer2->sql = "SELECT nombre, ST_AsGeoJSON(geom, 5) AS geojson FROM agua_lineas
      where ST_Intersects(agua_lineas.geom,                        
      ST_GeomFromText('POLYGON(({$east} {$north},{$east} {$south},{$west} {$south},{$west} {$north},{$east} {$north}))',4326))";

    $layer3 = new layer();
    $layer3->tableName = 'agua_poligonos';
    $layer3->displayName = 'Agua Poligonos';
    $layer3->featureColumn = 'nombre';
    $layer3->color = 'black';
    $layer3->fillColor = 'blue';
    $layer3->opacity = 1;
    $layer3->weight = 1;
    $layer3->fillOpacity = 1;
    $layer3->sql = "SELECT nombre, ST_AsGeoJSON(geom, 5) AS geojson FROM agua_poligonos
      where ST_Intersects(agua_poligonos.geom,                        
      ST_GeomFromText('POLYGON(({$east} {$north},{$east} {$south},{$west} {$south},{$west} {$north},{$east} {$north}))',4326))";
      
    $layer4 = new layer();
    $layer4->tableName = 'agua_puntos';
    $layer4->displayName = 'Agua Puntos';
    $layer4->featureColumn = 'nombre';
    $layer4->color = 'black';
    $layer4->fillColor = 'black';
    $layer4->opacity = 1;
    $layer4->weight = 1;
    $layer4->fillOpacity = 1;
    $layer4->sql = "SELECT nombre, ST_AsGeoJSON(geom, 5) AS geojson FROM agua_puntos
      where ST_Intersects(agua_puntos.geom,                        
      ST_GeomFromText('POLYGON(({$east} {$north},{$east} {$south},{$west} {$south},{$west} {$north},{$east} {$north}))',4326))";

    $layersArray = array($layer2,$layer3,$layer4);
    $mytext = 'none';
    foreach ($layersArray as $layer) {
      $features=[];
      $result2 = DB::select($layer->sql,[]);
        if (isset($result[0])){
          foreach($result2 AS $row2){
            if (isset($row2->geom)){
              unset($row2->geom);
            }
            $geometry=$row2->geojson=json_decode($row2->geojson);
            unset($row2->geojson);

            $row2->name=$layer->tableName;
            $row2->displayName=$layer->displayName;
            $row2->featureColumn=$layer->featureColumn;
            
            $feature=["type"=>"Feature", "geometry"=>$geometry, "properties"=>$row2];

            array_push($features, $feature);
            $featureCollection=["type"=>"FeatureCollection", "features"=>$features];
          }   
          if (isset($featureCollection)){
            $layer->geom=$featureCollection;
            unset($features);
            unset($featureCollection);
          }
        }
      
    }
/////////////////////////////////
    
    return [
      json_encode($result),
      json_encode($newrows),
      json_encode($layersArray[0]),
      json_encode($layersArray[1]),
      json_encode($layersArray[2]),
      json_encode($mytext)


    ];
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