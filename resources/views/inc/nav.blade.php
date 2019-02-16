<nav class="mynavbar navbar navbar-expand-lg" style="background-color: rgb(66, 214, 96);">
  <a class="navbar-brand" href="/mostrarmapas">MTP Biodiversidad</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarText">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" href="ingresardatos">Ingresar Datos</a>
      </li>
      {{-- <li class="nav-item">
        <a class="nav-link" href="/descargar">Descargar</a>
      </li> --}}
      <li class="nav-item">
        <a class="nav-link" href="/mostrarmapas">Mostrar Mapas</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/ingresarexcel">Ingresar Excel</a>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto">
        <?php
            $root_directory = "testdir";
                if (session('email')) {
                    $useremail=session('email');
                    if (session('admin')){
                        echo "<li class='nav-item'><a class='nav-link' href='/admin'>Admin</a></li>";

                    }
                    echo "<li class='nav-item'><a class='nav-link' id='useremail' >{$useremail}</a></li>";

                    echo "<li class='nav-item'><a class='nav-link' href='/logout'>Logout</a></li>";

                } else {
                    echo "<li class='nav-item'><a class='nav-link' href='/login'>Login</a></li>";

                    echo "<li class='nav-item'><a class='nav-link' href='/register'>Registro</a></li>";
                }
        ?>
    </ul>
  </div>
</nav>
 <div class='bodycontainer'>