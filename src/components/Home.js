import React from 'react';
import { Table, Card } from 'react-bootstrap';
import {Fetch} from 'toolbox/Fetch';

export default function Home() {
    const listNewsUri = `http://localhost:8080/elastic/anonymous`;
    return (
        <>
            <Card>
                <Card.Header><b>실시간 지진정보서비스 바로가기 ▼ ▼ ▼ (아래 이미지를 클릭하세요)</b></Card.Header>
            </Card>
            <Table>
                <tbody>
                    <tr>
                        <td align="center">
                            <a href="https://www.weather.go.kr/pews/" target="_blank" rel="noreferrer">
                                <img
                                    src="https://cdn-icons-gif.flaticon.com/12749/12749355.gif"
                                    alt="Flood"
                                    width={200}
                                    height={200}
                                />
                            </a>
                        </td>
                    </tr>
                </tbody>
            </Table>

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
        </>
    );
}

function RenderSuccess(newsList) {
    console.log("newsList", newsList);

    // 데이터가 없거나 hits가 없다면 빈 배열을 반환
    const hits = newsList?.hits?.hits || [];

    return (
        <>
            {hits.map((hit, index) => (
                <tr key={index}>
                    <td>{hit._source.newstitle}</td>
                    <td>{hit._source.newsdate}</td>
                </tr>
            ))}
        </>
    );
}