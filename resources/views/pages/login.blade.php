<?php
    session_start();
    session(['error' => []]);

   $root_directory = "testdir";
    if ($_SERVER['REQUEST_METHOD']=='POST') {
        $email=$_POST['email'];
        $password=$_POST['password'];
       if (DB::select('select email from usuario where email = ?', [$_POST['email']])){
         
            $gethashpassword=DB::select('select hash_password from usuario where email = ?', [$_POST['email']]);

            if (password_verify($_POST['password'], $gethashpassword[0]->hash_password)) {
                echo("Logged in successfully");
                //Assign Visitante
             


                if (DB::select('select visitante from usuario where email = ?', [$_POST['email']])[0]->visitante=='1'){
                    session(['visitante' => 1]);
                }else{
                    session(['visitante' => 0]);
                }
                //check for admin

                if (DB::select('select administrador from usuario where email = ?', [$_POST['email']])[0]->administrador=='true'){
                    session(['admin' => 1]);
                }else{
                    session(['admin' => 0]);
                }
                session(['email' => $email]);
                session(['error' => ['']]);
                DB::update('update usuario set fecha_ultimo_login = CURRENT_DATE where email = ?', [$_POST['email']]);
                DB::update('update usuario set hora_ultimo_login = CURRENT_TIME where email = ?', [$_POST['email']]);
                

                return redirect()->to('/ingresardatos')->send();
            } else {
                session(['error' => ['contrasenia incorrecto']]);
            }
            
        } else {
            session(['error' => ['email no existe']]);
        }
    } else {
        $email="";
        $password="";
    }
    
?>

    @include('inc/header')
        @include('inc/nav')
    <div id="loginGrid">

      <div id="loginHeader">
        <h4 class='titleHeaders'>
          <strong>
          Monitoreo Integrado para la Planeación <br/>de los Paisajes Sostenibles (MIPPS)!!!!!!
          </strong>
        </h4>       
      </div>
               
      <div id="loginBody" class="display: flex" style="text-align:center;">
          <div class=" d-inline-flex flex-column justify-content-center" style='width: 350px'>
            <?php 
                if (session('error')) {
                    foreach (session('error') as $msg) {
                        echo "<p class='bg-danger2 text-center'>{$msg}</p>";
                    }
                }
            ?>
              
              <form id="login-form"  method="post" role="form" style="display: block;">
                  {{ csrf_field() }}
                  <div class="form-group p-2">
                      <input type="text" name="email" id="email" tabindex="1" class="form-control" placeholder="Email" value='<?php echo $email; ?>' required>
                  </div>
                  <div class="form-group p-2">
                      <input type="password" name="password" id="login-
                  password" tabindex="2" class="form-control" placeholder="Contraseña" value='<?php echo $password; ?>' required>
                  </div>
                  
                  <div class="form-group pt-2 pb-2 pl-5 pr-5 ">
                      <div class="row">
                              <input type="submit" name="login-submit" id="login-submit" tabindex="4" class="form-control btn btn-success p-15" value="Log In">
                      </div>
                  </div>
                  <div class="form-group pt-2 pb-2 pl-5 pr-5 ">
                      <div class="row">
                              <a href="/reset_1" tabindex="5" class="form-control btn btn-success p-15">Reiniciar su contraseña</a>
                      </div>
                  </div> 
                
                
              </form>
            </div>
          </div>

            <div id="loginFooter" class="creditFooter">
                <h6 class='titleHeaders'>
                    <strong>Desarrollo conceptual y conducción de grupos de trabajo:</strong> <br/> 
                  Jesús Hernández Castán, Alfredo Gámez, <br/> 
                  Daniel Espinoza, Tonatiuh González <br/> 
                  <br/> 
                  SEMARNAT Delegación Puebla,
                  CONAFOR Gerencia estatal Puebla<br/> 
                  
                </h6>
                <h6  class='titleHeaders'>
                  <strong>Programación: </strong> <br/> 
                  Forest Carter - Peace Corps
                </h5>
            </div>

        </div>
                      
          
    </div>
        @include('inc/footer')
   