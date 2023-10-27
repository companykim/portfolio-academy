import { createGlobalStyle } from "styled-components";

const CustomOverlay2Style = createGlobalStyle `
    .overlaybox {
        position: absolute;
        left: 0;
        bottom: 40px;
        width: 288px;
        height: 132px;
        margin-left: -144px;
        text-align: left;
        overflow: hidden;
        font-size: 12px;
        font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;
        line-height: 1.5;
    }

    .overlaybox * {
        padding: 0;
        margin: 0;
    }
    .overlaybox .info {
        width: 286px;
        height: 120px;
        border-radius: 5px;
        border-bottom: 2px solid #ccc;
        border-right: 1px solid #ccc;
        overflow: hidden;
        background: #fff;
    }
    .overlaybox .info:nth-child(1) {
        border: 0;
        box-shadow: 0px 1px 2px #888;
    }

    .info .title { 
        padding: 5px 0 0 10px;
        height: 30px;
        background: #eee;
        border-bottom: 1px solid #ddd;
        font-size: 14px;
        font-weight: bold;
    }
    .info .close {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #888;
        width: 17px;
        height: 17px;
        background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png');
    }
    .info .close:hover {
        cursor: pointer;
    }

    .info .body {
        position: relative;
        overflow: hidden;
        background
    }

    .info .desc {
        position: relative;
        margin-left: 13px 0 0 90px;
        height: 75px;
    }

    .info .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
    }
`;

export default CustomOverlay2Style;