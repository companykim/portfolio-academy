import React from 'react';
import {Fetch} from 'toolbox/Fetch';

export default function Home() {
    //const listNewsUri = `http://localhost:8080/news/anonymous/listAll`;
    const listNewsUri = `http://localhost:9200/news*/_search?q=newstitle="검찰"andnewstitle="이재명"&pretty`;

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>기사</th>
                        <th>날짜</th>
                    </tr>
                </thead>
                <tbody>
                    <Fetch uri={listNewsUri} renderSuccess={RenderSuccess} />
                </tbody>
            </table>
        </div>
    );
}

function RenderSuccess(newsList) {
    return newsList?.map(news => (
        <tr>
            <td>{news.newsdate}</td>
            <td>{news.newstitle}</td>
        </tr>
    ))
}