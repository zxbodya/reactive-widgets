<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>

<?php

require "./vendor/autoload.php";
require "./Prerender.php";

$stats = json_decode(file_get_contents('../build/stats.json'));
$publicPath = $stats->publicPath;
$main = $stats->assetsByChunkName->main;
$scriptUrl = $publicPath . (is_string($main) ? $main : $main[0]);

$prerender = new Prerender('http://localhost:3000/render');
$prerender->isEnabled = true;
ob_start();
?>

<?= $prerender->render('test', ['name' => 'World']); ?>

<?php
$html = ob_get_contents();
ob_end_clean();
echo $prerender->replaceResults($html);
?>

<?= $prerender->bootstrapScript();?>
<script src="<?= $scriptUrl ?>"></script>
</body>
</html>
