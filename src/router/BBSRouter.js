import React from 'react';
import { Route, Routes } from "react-router-dom";

import Home from 'components/Home';
import PostList from 'components/post/PostList';
import PostDetail from 'components/post/PostDetail';
import Register from 'components/Register';
import MemberList from 'components/MemberList';
import PostMng from 'components/post/PostMng';
import ShelterMap from 'components/shelter/ShelterMap';
import Makers from 'components/Makers';
import Manual from 'components/post/Manual';
import ShelterMap_Google from 'components/shelter/ShelterMap_Google';

function BBSRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/board" element={<PostList />} />
            <Route path="/post" element={<PostDetail />} />
            <Route path="/post/managePost" element={<PostMng />} />
            <Route path="/sign-up" element={<Register />} />
            <Route path="/member-list/:ownerId" element={<MemberList />} />
            <Route path="/shelter" element={<ShelterMap_Google />} />
            <Route path="/manual" element={<Manual />} />
            <Route path="/makers" element={<Makers />} />
        </Routes>
    );
}

export default BBSRouter;