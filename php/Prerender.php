<?php

use GuzzleHttp\Client;

class Prerender
{
    private $serverUrl;
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


    public function render($id, $data)
    {
        $this->_elements[$id] = $data;
        if ($this->isEnabled) {
            return "<div id=\"{$id}\"><!-- prerender:{$id} --></div>";
        }
        return "<div id=\"{$id}\"></div>";
    }


    public function bootstrapScript()
    {
        $data = json_encode($this->_elements);

        return "<script>window.bootstrapData=$data;</script>";
    }

    public function replaceResults($html)
    {
        if ($this->isEnabled) {
            $client = new Client(['base_url' => $this->serverUrl]);
            $response = $client->post(
                '/render',
                [
                    'json' => [
                        'components' => $this->_elements
                    ]
                ]
            );


            $prerenderResult = $response->json();

            $renderedBlocks = $prerenderResult['components'];

            $result = preg_replace_callback(
                '/<!-- prerender:([^ ]+) -->/i',
                function ($matches) use ($renderedBlocks) {
                    $id = $matches[1];
                    if (isset($renderedBlocks[$id])) {
                        $content = $renderedBlocks[$id];

                        return $content;
                    } else {
                        return '';
                    }
                },
                $html
            );

            return $result;
        }

        return $html;
    }
}
