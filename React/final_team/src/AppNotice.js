import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/AppNotice.css'

export default function AppNotice({ name, userId }) {
  //axios -> json 으로 데이터 받아오는 경우

  const [notice, setNotice] = useState([]);
  const [current, setCurrent] = useState(0);
  const [text, setText] = useState('');
  const [page, setPage] = useState('main');

  const getNotice = () => {
    axios
      .get('http://localhost:4000/notice')
      .then((response) => setNotice(response.data))
      .catch(console.log);
  };

  // 컴포넌트 실행되면 json notice(공지사항) 정보를 get해서 setNotice 함
  useEffect(() => {
    getNotice();
  }, []);
  useEffect(() => {
    axios
      .get('http://localhost:4000/notice/' + current)
      .then((response) => setText(response.data.content))
      .catch(console.log);
  }, [current]);
  console.log(current);

  //공지사항 삭제
  const handleOnclickRemoveNotice = (id) => {
    axios
      .delete('http://localhost:4000/notice/' + id)
      .then(() => getNotice())
      .catch(console.log);
  };

  //공지사항 추가
  const handleOnclickAddNotice = ({ title, content }) => {

    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const date = year + '-' + month  + '-' + day;

    const id = notice.length === 0 ? 1 : notice[notice.length - 1].id + 1;
    const data = {
      id,
      title,
      name,
      date,
      content,
    };
    axios
      .post('http://localhost:4000/notice/', data)
      .then(() => getNotice())
      .catch(console.log);
  };

  //공지사항 수정
  const handleOnclickUpdateNotice = (id, { title, name, date, content }) => {
    const updateData = notice.map((n) => {
      if (n.id == id) return { ...n, title, name, date, content };
      else return n;
    });

    axios
      .put('http://localhost:4000/notice/', updateData)
      .then(() => getNotice())
      .catch(console.log);
  };

  // 작성자 -> name
  // div에 height: '85%'만 놔두고 나머지는 삭제해도 상관 x
  return (
    <div id='NoticePage' style={{ height: '85%', backgroundColor: 'rgb(206, 206, 206)', paddingTop: '30px' }}>
      <h1 style={{ fontSize: '50px', marginLeft: '70px', marginBottom:'20px' }}>공지사항 페이지</h1>
      {page == 'main' && (
        <Main
          setPage={setPage}
          notice={notice}
          setCurrent={setCurrent}
          handleOnclickRemoveNotice={handleOnclickRemoveNotice}
          handleOnclickAddNotice={handleOnclickAddNotice}
        />
      )}
      {page == 'page2' && <Test text={text} setPage={setPage} />}

    </div>
  );
}
const Main = ({
  notice,
  setCurrent,
  setPage,
  handleOnclickRemoveNotice,
  handleOnclickAddNotice,
}) => {
  return ( <div id='notice'>
    <div>
      <AddNotice handleOnclickAddNotice={handleOnclickAddNotice} />
    </div>
    <table>
      <thead>
        <tr>
          <td>번호</td>
          <td>제목</td>
          <td>작성자</td>
          <td>작성일</td>
        </tr>
      </thead>
      {notice.map((n, index) => (
        <tbody key={n.id}>
          <tr>
            <td>{index+1}</td>
            <td
              onClick={() => {
                setPage('page2');
                setCurrent(n.id);
              }}
            >
              {n.title}
            </td>
            <td>{n.name}</td>
            <td>
              {n.date}
              <button onClick={() => handleOnclickRemoveNotice(n.id)}>
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      ))}
    </table>
    </div>
  );
};
const Test = ({ text, setPage }) => {
  return (
    <div>
      <button
        onClick={() => {
          setPage('main');
        }}
      >
        뒤로 가기
      </button>
      <hr />
      {text}
    </div>
  );
};

//Notice 추가시 실행 함수
const AddNotice = ({ id, handleOnclickAddNotice }) => {
  const [isAdd, setIsAdd] = useState(false);
  const [title, settitle] = useState('공지사항 제목');
  const [content, setcontent] = useState('공지 내용');

  if (isAdd)
    return (
      <div>
        <div>
          제목{' '}
          <input
            type="text"
            size={10}
            value={title}
            onChange={(e) => settitle(e.target.value)}
          />
        </div>

        <div>
          공지내용{' '}
          <input
            type="text"
            size={10}
            value={content}
            onChange={(e) => setcontent(e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            handleOnclickAddNotice({ title, content });
            settitle('제목');
            setcontent('작성내용');
          }}
        >
          추가하기
        </button>
        <button onClick={() => setIsAdd(!isAdd)}>취소하기</button>
      </div>
    );
  else return <button style={{fontSize: '20px'}} onClick={() => setIsAdd(!isAdd)}>공지 사항 작성</button>;
};