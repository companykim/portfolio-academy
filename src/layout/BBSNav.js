import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fetch } from 'toolbox/Fetch';
import LoginModal from 'components/LoginModal';
import AppContext from "context/AppContextProvider";

export default function BBSNav() {
    const boardListUri = `http://localhost:8080/bb/anonymous/listAll`;
    const { auth } = useContext(AppContext);
    const isManager = auth?.roles?.includes("manager");

    return (
        <header>
            <Link to="/">Home</Link>
            &nbsp;&nbsp;|
            <Fetch uri={boardListUri} renderSuccess={renderSuccess} />
            {isManager ? <Link key="dfhdefh" to={`/member-list/0001`}>
                회원목록
            </Link> : ""}
            
            <Link key='아직못정함ㅋㅋ' to={`/shelter`}>
                &nbsp;&nbsp;대피소 안내&nbsp;
            </Link>
            <LoginModal />
        </header>
    );

    function renderSuccess(boardList) {
        return <>
            {boardList.map(board => (
                <Link key={board.id} to={`/board`}
                    state={{ boardId: board.id, page: 1 }}>
                    &nbsp;&nbsp;{board.name}&nbsp;
                </Link>
            ))}
        </>
    }

}