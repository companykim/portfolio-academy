# 필요한 패키지 import
import requests
from bs4 import BeautifulSoup
import bs4.element
import datetime
import warnings
warnings.filterwarnings('ignore')
import re
import pandas as pd
import time
from datetime import datetime
import os
import pymysql

# 뉴스 저장소 선언
news_df = pd.DataFrame(
    data=None
    , index=None
    , columns=['date','title','link']
)

# ConnectionError방지
headers = {'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'}

# BeautifulSoup 객체 생성
def get_soup_obj(url):
    res = requests.get(url, headers = headers, verify=False)
    soup = BeautifulSoup(res.text,'lxml')
    
    return soup

# html에서 원하는 속성 추출하는 함수 만들기 (기사, 추출하려는 속성값)
def news_attrs_crawler(articles,attrs):
    attrs_content=[]
    for i in articles:
        attrs_content.append(i.attrs[attrs])
    return attrs_content

#html생성해서 기사크롤링하는 함수 만들기(url): 링크를 반환
def articles_crawler(url):
    #html 불러오기
    original_html = requests.get(url, headers=headers, verify=False)
    html = BeautifulSoup(original_html.text, "html.parser")

    url_naver = html.select("div.group_news > ul.list_news > li div.news_area > div.news_info > div.info_group > a.info")
    url = news_attrs_crawler(url_naver,'href')
    return url

# 뉴스의 기본 정보 가져오기
def get_top3_news_info():
    news_urls =[]
    
    # 해당 분야 상위 뉴스 목록 주소
    sec_url = "https://news.naver.com/main/list.nhn?mode=LSD&mid=sec&sid1=001"
    
    # 해당 분야 상위 뉴스 HTML 가져오기
    soup = get_soup_obj(sec_url)
  
    # 해당 분야 상위 뉴스 3개 가져오기
    lis3 = soup.find('ul', class_='type06_headline').find_all("li", limit=10)
    for li in lis3:
        news_url = li.a.attrs.get('href')
        news_urls.append(news_url)
        
    return news_urls

# 상위 3개 뉴스 크롤링
def F_crawling(news_urls) :
    news_titles = []
    news_dates = []
    news_url = []

    for url in news_urls:
        news_html = get_soup_obj(url)

        # 뉴스 제목 가져오기
        title = news_html.select_one("#ct > div.media_end_head.go_trans > div.media_end_head_title > h2")
        if title == None:
            title = news_html.select_one("#content > div.end_ct > div > h2")

        # html태그제거 및 텍스트 다듬기
        pattern1 = '<[^>]*>'
        title = re.sub(pattern=pattern1, repl='', string=str(title))
        pattern2 = """[\n\n\n\n\n// flash 오류를 우회하기 위한 함수 추가\nfunction _flash_removeCallback() {}"""

        news_titles.append(title)

        # 날짜 가져오기
        try:
            html_date = news_html.select_one("div#ct > div.media_end_head > div.media_end_head_info > div span")
            news_date = html_date.attrs['data-date-time']
        except AttributeError:
            news_date = news_html.select_one("#content > div.end_ct > div > div.article_info > span > em")
            news_date = re.sub(pattern=pattern1,repl='',string=str(news_date))
        news_dates.append(news_date)

        news_url.append(url)
    
    a = pd.DataFrame({'date':news_dates,'title':news_titles,'link':news_url})

    #중복 행 지우기
    a = a.drop_duplicates(keep='first',ignore_index=True)

    return a

# 태그 제거 등 처리1
def clean_text(d):
  text = re.sub(r'\([^)]*\)', '', str(d))
  text = re.sub(r'\[[^]]*\]', '', text)
  text = re.sub(r'\<[^>]*\>', '', text)
  pattern = r'[^가-힣0-9a-zA-Z\s]'
  text = re.sub(pattern, ' ', text)
  text = re.sub(r'사진', ' ', text)
  text = re.sub(r'.*뉴스', ' ', text)
  text = re.sub("\n", ' ', text)
  text = re.sub("  +", " ", text)
  return text

# 태그 제거 등 처리2
def text_clean(text):
  pattern = '([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)' # E-mail제거
  text = re.sub(pattern, '', text)
  pattern = '(http|ftp|https)://(?:[-\w.]|(?:%[\da-fA-F]{2}))+' # URL제거
  text = re.sub(pattern, '', text)
  pattern = '<[^>]*>'         # HTML 태그 제거
  text = re.sub(pattern, '', text)
  pattern = '[\n]'            # \n제거
  text = re.sub(pattern, '', text)
  pattern = '[\t]'            # \n제거
  text = re.sub(pattern, '', text)
  pattern = '[\']'           
  text = re.sub(pattern, '', text)
  pattern = '[\"]'            
  text = re.sub(pattern, '', text)
  return text  

# DB 전달
def to_dbeaver(NewsDate, NewsTitle, NewsLink) :
    conn = pymysql.connect(
        host='localhost'
        , user='root'
        , password='root'
        , db='mariadb'
        , charset='utf8'
    )
    cur = conn.cursor()
    
    for date,title,link in zip(NewsDate, NewsTitle, NewsLink):
        sql = "INSERT IGNORE INTO news_crawling (id, NewsDate, NewsTitle, NewsLink) VALUES ({}, {}, {})".format("\""+date+"\"", "\""+title+"\"", "\""+link+"\"")
        try : 
            cur.execute(sql)
        except Exception as e :
            print('Error Message :', e)
            return
    conn.commit()
    conn.close()
# 뉴스의 기본 정보 가져오기 (수정된 함수)
def get_top3_news_info(keyword=None):
    news_urls =[]
    
    # 해당 분야 상위 뉴스 목록 주소
    sec_url = "https://news.naver.com/main/list.nhn?mode=LSD&mid=sec&sid1=001"
    
    # 해당 분야 상위 뉴스 HTML 가져오기
    soup = get_soup_obj(sec_url)
  
    # 해당 분야 상위 뉴스 3개 가져오기
    lis3 = soup.find('ul', class_='type06_headline').find_all("li", limit=10)
    for li in lis3:
        news_url = li.a.attrs.get('href')
        if keyword:
            if keyword in li.a.text:  # 키워드가 제목에 포함된 경우에만 추가
                news_urls.append(news_url)
        else:
            news_urls.append(news_url)
        
    return news_urls

# 무한루프 크롤링 (수정된 부분만 표시)
while True :
    
    news_urls = get_top3_news_info()  # 수정된 부분
    a = F_crawling(news_urls)

    df_all = pd.merge(a, news_df, how='outer', indicator=True)
    news_df = pd.concat([news_df, a], ignore_index=True, keys=['date','title','link'])
    news_df = news_df.drop_duplicates(keep='first',ignore_index=True)
    str_expr = '_merge == \"left_only\"'
    df_all2 = df_all.query(str_expr)
    df_all2.drop(columns=['_merge'], inplace=True)

    df_all2.dropna(axis=0, inplace=True)

    df_all2['title'] = df_all2['title'].apply(text_clean)
    df_all2['title'] = df_all2['title'].apply(clean_text)

    df_all2.dropna(axis=0, inplace=True)

    print(df_all2['title'])

    newsdate = df_all2['date'].to_list()
    newstitle = df_all2['title'].to_list()
    newslink = df_all2['link'].to_list()

    to_dbeaver(newsdate, newstitle, newslink)
    

    # ... (기존 코드는 여기에 놓여있습니다)

    time.sleep(1)