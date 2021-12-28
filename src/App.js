import React, {useEffect, useState} from 'react';
import './Style/App.css';
// import ClassCouter from './components/ClassCounter';
// import Counter from './components/Counter';
import PostList from './components/PostList';
// import MyButton from './components/UI/button/MyButton';
// import MyInput from './components/UI/input/MyInput';
import PostForm from './components/PostForm';
// import MySelect from './components/UI/select/MySelect';
// import MyInput from './components/UI/input/MyInput';
import PostFilter from './components/PostFilter';
import MyModal from './components/UI/myModal/MyModal';
import MyButton from './components/UI/button/MyButton';
import {usePosts} from './hooks/usePosts';
import PostService from './API/PostService';
import Spinner from './components/UI/spinner/Spinner.jsx';
import { useFetching } from './hooks/useFetching';
import {getPagesCount, getPagesArray} from './utils/pages';
import Pagination from './components/UI/pagination/Pagination';



function App() {
  const [posts, setPosts] = useState([
    // {id: 1, title: 'JavaScript', body: 'Description'},
    // {id: 2, title: 'Python', body: 'Description2'},
    // {id: 3, title: 'Java', body: 'Description1'}
  ])
  // const [posts1, setPosts1] = useState([
  //   {id: 1, title: 'Python', body: 'Description'},
  //   {id: 2, title: 'Python 2', body: 'Description'},
  //   {id: 3, title: 'Python 3', body: 'Description'}
  // ])
  // const [title, setTitle] = useState('')
  // const [body, setBody] = useState('')
  
  // const bodyInputRef = useRef(); /*возможность напрямую получить доступ к содержимому ДОМ-еллемента через React.forvardRef*/
  // const addNewPost = (e) => {
  //   e.preventDefault()
  //   // const newPost = {   //вся информация уже есть в объекте useState, поэтому можно не создавать новый объект, а резвернуть его прямо в setPost добавив айди
  //   //   id: Date.now(),
  //   //   title,
  //   //   body
  //   // }
  //   setPosts([...posts, {...post, id: Date.now()}])
  //   setPost({title:'', body:''})
  //   // setTitle('')
  //   // setBody('')
  //   // console.log(title, body)
  //   // console.log(bodyInputRef.current.value)
  // }
  // const [selectedSort, setSelectedSort] = useState('')

  // const [searchQuery, setSerchQuery] = useState('')
  const [filter, setFilter] = useState({sort:'', query:''});
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  // const [isPostsLoading, setIsPostsLoading] = useState(false);
  // let pagesArray = getPagesArray(totalPages);
  // []
  // for (let i = 0; i < totalPages; i++) {
  //   pagesArray.push(i + 1);

  // }
  // console.log([pagesArray]);
  const [fetchPosts, isPostsLoading, postError] = useFetching(async (limit, page) => {
    const response = await PostService.getAll(limit, page);
    setPosts(response.data)
    const totalCount = response.headers['x-total-count'];
    setTotalPages(getPagesCount(totalCount, limit));
  })
  console.log(totalPages);
  useEffect(() => {
    fetchPosts(limit, page)
  }, [])
  // const sortedPosts = useMemo(() => {
  //   console.log('worked function of PostSorted');
  //   if(filter.sort) {
  //     return [...posts].sort((a, b) => a[filter.sort].localeCompare(b[filter.sort]))
  //   }
  //   return posts;

  // }, [filter.sort, posts])

  // const sortedAndSearchedPosts = useMemo(() => {
  //   return sortedPosts.filter(post => post.title.toLowerCase().includes(filter.query.toLocaleLowerCase()))

  // }, [filter.query, sortedPosts])

  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false)
  }

  // async function fetchPosts() {
  //   setIsPostsLoading(true);
  //   // const posts = await PostService.getAll();
  //   // setPosts(posts)
  //   setIsPostsLoading(false);
  // }
  
  //получаем пост из дочернего компонента
  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }

  const changePage = (page) => {
    setPage(page)
    fetchPosts(limit, page)
  }

  // const sortPost = (sort) => {
  //   setSelectedSort(sort);    
  // }



  return (
    <div className="App">
      <MyButton style={{marginTop: 30}}onClick={() => setModal(true)}>
        Create Post
      </MyButton>
      <MyModal visible={modal} setVisible={setModal} >
        <PostForm create={createPost}/>        
      </MyModal>
      <hr style={{margin: '15px 0'}}/>      
      <PostFilter
        filter={filter}
        setFilter={setFilter}
      />
      {postError &&
        <h1>It's error ${postError}</h1>
        }
      {isPostsLoading
        ? <Spinner/>
        :<PostList remove={removePost} posts={sortedAndSearchedPosts} title={'Post List JS'}/>
        }
        <Pagination
         page={page}
         changePage={changePage}
         totalPages={totalPages}
        />
      {/* <div className='page__wrapper'>
        {pagesArray.map(p =>
          <span
            onClick={() => changePage(p)}
            key={p}
            className={page === p ? 'page page_active' : 'page'}
            >
            {p}
            </span>
        )}
      </div> */}
      
      
      {/* <Counter/>
      <ClassCouter/> */}
      {/* <PostList posts={posts1} title={'Post List Python'}/> */}
          
    </div>
  );
}

export default App;
