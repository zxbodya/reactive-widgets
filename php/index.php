<?php

require "./vendor/autoload.php";
require "./Prerender.php";

$prerender = new Prerender('http://localhost:3000/render');
$prerender->isEnabled = true;
ob_start();

?>
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<?= $prerender->render('test', ['name' => 'World 1']); ?>
<?= $prerender->render('test', ['name' => 'World 2']); ?>
<?= $prerender->render('test', ['name' => 'World 3']); ?>
<?= $prerender->bootstrapScript();?>
<?= $prerender->bundleScript();?>
</body>
</html>
<?php

$html = ob_get_contents();
ob_end_clean();
echo $prerender->replaceResults($html);

?>
