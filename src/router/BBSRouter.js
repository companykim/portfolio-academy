import React from 'react';
import { Route, Routes } from "react-router-dom";

import Home from 'components/Home';
import PostList from 'components/post/PostList';
import PostDetail from 'components/post/PostDetail';
import Register from 'components/Register';
import MemberList from 'components/MemberList';
import PostMng from 'components/post/PostMng';
import ShelterMap from 'components/shelter/ShelterMap';

function BBSRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/board" element={<PostList />} />
            <Route path="/post" element={<PostDetail />} />
            <Route path="/post/managePost" element={<PostMng />} />
            <Route path="/sign-up" element={<Register />} />
            <Route path="/member-list/:ownerId" element={<MemberList />} />
            <Route path="/shelter" element={<ShelterMap />} />
        </Routes>
    );
}

export default BBSRouter;