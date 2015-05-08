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
    <title>React widgets, Demo page</title>
</head>
<body>

<h2>The same component rendered twice with different params</h2>
<?= $prerender->render('test', ['name' => 'World 1']); ?>
<?= $prerender->render('test', ['name' => 'World 2']); ?>

<!-- scripts -->
<?= $prerender->bootstrapScript();?>
<?= $prerender->bundleScript();?>
</body>
</html>
<?php

$html = ob_get_contents();
ob_end_clean();
echo $prerender->replaceResults($html);

?>
