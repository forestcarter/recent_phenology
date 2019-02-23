

<?php 
  $tiles_directories = scandir('./tiles4');

  $fh = fopen('../python/colors.txt','r');
  $colorsarray=[];
  $legendexclusions=['-13006','-13006','-13004','-13001','-4001'];
  while ($line = fgets($fh)) {
    $exploded = explode(" ", $line);
    $nonewline = substr($exploded[3], 0, -1);
    $entry = array("range"=>$exploded[0], "color"=>"rgb($exploded[1],$exploded[2],$nonewline)");
    $entry["range"]=='nv' && $entry["range"]='No Data';
    $entry["range"]=='-12999' && $entry["range"]='Low Quality Data';
    !in_array($entry["range"],$legendexclusions) && $colorsarray[]=$entry;
  }
  fclose($fh);

  $json=json_encode($tiles_directories);
  $json2=json_encode($colorsarray);
?>

<script>
  var tiles_directories = {!! $json !!};
  var colorsarray = {!! $json2 !!};
</script>

<link rel="stylesheet" href="{{asset('css/app.css')}}">

<script src="/js/app.js"></script>

@include('inc/header')

        
    
        <div id="app"></div>
        <link rel="stylesheet" href="leaflet_assets/leaflet.css"> 
        <script src="{{ asset('leaflet_assets/index.js') }}" ></script>  

        @include('inc/footer')


        

