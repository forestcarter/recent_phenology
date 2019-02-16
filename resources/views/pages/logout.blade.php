
<?php
    session(['email' => '']);
    session(['admin' => '0']);
    return redirect()->to('/login')->send();
?>
