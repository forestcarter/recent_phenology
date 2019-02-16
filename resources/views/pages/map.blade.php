

<?php 
  $tiles_directories = scandir('./tiles4');
  $geojson=json_encode($tiles_directories);
?>

<script>
  var tiles_directories = {!! $geojson !!};
</script>

<link rel="stylesheet" href="{{asset('css/app.css')}}">

<script src="/js/app.js"></script>

@include('inc/header')

        
    
        <div id="app"></div>
        <link rel="stylesheet" href="leaflet_assets/leaflet.css"> 
        <script src="{{ asset('leaflet_assets/index.js') }}" ></script>  

        @include('inc/footer')


        

