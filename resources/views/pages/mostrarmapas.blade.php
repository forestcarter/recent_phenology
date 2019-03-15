<?php
if (!session('email')){
    return redirect()->to('/login')->send();
}

$tilefoldersraw=scandir(getcwd().DIRECTORY_SEPARATOR.'tiles4');
$tilefolders=json_encode(array_diff($tilefoldersraw,array('..', '.')));
?>
<script>
  var tileFolders = {!! $tilefolders !!};
</script>

@include('inc/loadlayers')
@include('inc/header')
@include('inc/nav')

        <div class="container">
            <h1 class="text-center">Mostrar Mapas</h1>
            <p></p>
        </div> <!--Container-->
        
    
        <div id="app"></div>
        <link rel="stylesheet" href="leaflet_assets/leaflet.css"> 
        <script src="{{ asset('leaflet_assets/index.js') }}" ></script>  

        @include('inc/footer')


