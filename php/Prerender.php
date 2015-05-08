<?php

use GuzzleHttp\Client;

class Prerender
{
    private $serverUrl;
    private $_index = 0;
    private $_elements = [];
    public $isEnabled = false;

    /**
     * Prerender constructor.
     *
     * @param $serverUrl
     */
    public function __construct($serverUrl)
    {
        $this->serverUrl = $serverUrl;
    }


    public function render($name, $data = [])
    {
        $id = 'react_' . $this->_index;
        $this->_index += 1;

        $this->_elements[$id] = ['component' => $name, 'params' => $data];
        if ($this->isEnabled) {
            return "<div id=\"{$id}\"><!-- prerender:{$id} --></div>";
        }

        return "<div id=\"{$id}\"></div>";
    }

    public function bootstrapScript()
    {
        return '<!-- prerender:bootstrap -->';
    }

    public function bundleScript()
    {
        return '<!-- prerender:scripts -->';
    }

    public function replaceResults($html)
    {
        if ($this->isEnabled && $this->_index !== 0) {
            $client = new Client(['base_url' => $this->serverUrl]);
            try {
                $response = $client->post(
                    '/render',
                    [
                        'json' => $this->_elements,
                        'timeout' => 3 //seconds
                    ]
                );


                $renderedBlocks = $response->json();
            } catch (\Exception $e) {
                // todo: log somewhere
                // but while components are isomorphic,
                // this will work event if we ignore an error
                $renderedBlocks = [];
            }
        } else {
            $renderedBlocks = [];
        }

        $result = preg_replace_callback(
            '/<!-- prerender:([^ ]+) -->/i',
            function ($matches) use ($renderedBlocks) {
                $id = $matches[1];
                if (isset($renderedBlocks[$id])) {
                    $content = $renderedBlocks[$id];

                    return $content;
                } else {
                    $result = '';
                    switch ($id) {
                        case 'bootstrap':
                            $data = json_encode($this->_elements);
                            $result = "<script>window.bootstrapData=$data;</script>";
                            break;
                        case 'scripts':
                            $stats = json_decode(file_get_contents('../build/stats.json'));
                            $publicPath = $stats->publicPath;
                            $main = $stats->assetsByChunkName->main;
                            $scriptUrl = $publicPath . (is_string($main) ? $main : $main[0]);

                            $result = "<script src=\"$scriptUrl\"></script>";
                            break;
                    }

                    return $result;
                }
            },
            $html
        );

        return $result;
    }
}
