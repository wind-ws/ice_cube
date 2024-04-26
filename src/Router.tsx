
import { Router, Route, useNavigate } from "@solidjs/router";
import PageRoot from "./page/PageRoot";
import PageHome from "./page/PageHome";
import { store_book } from "./tool/store/book";
import { store_setting } from "./tool/store/setting";
import PageLoading from "./page/PageLoading";
import PageAddWord from "./page/PageAddWord";
import PageFilterList from "./page/PageFilterList";
import PageCreateFilter from "./page/PageCreateFilter";
import PageRecite from "./page/PageRecite";

export default () => {



   return <Router root={PageRoot}>
      <Route path="/loading" component={PageLoading}></Route>
      <Route path={["/","/home"]} component={PageHome} ></Route>
      <Route path="/add_word/:book_name" component={PageAddWord}></Route>
      <Route path="/filter_list" component={PageFilterList} ></Route>
      <Route path="/create_filter" component={PageCreateFilter}></Route>
      <Route path="/recite" component={PageRecite}></Route>

   </Router>
}

