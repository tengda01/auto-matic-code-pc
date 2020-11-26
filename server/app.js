const Koa = require('koa');
const app = new Koa();

app.listen(7200, () => {
  console.log('[Koa] Server is starting at port 7200!');
});

app.use(async ctx => {
  let postData = await parsePostData(ctx)
  console.log(postData)
  // for (let i in postData) {
  //   console.log(i)
  // }
  const url = ctx.request.url
  if (url === '/getPCPage') {
    const { rows, basicInfo } = postData
    console.log(rows)
    console.log(Array.isArray(rows))

  }

  ctx.body = 'a';
const page = 
`<template>
    <EleListPage
      :tableCommonOptions="tableCommonOptions"
      :listLoading="listLoading"
      :loadTableData="loadTableData"

      :tableList="tableList"
      :onSaveCustom="onSaveCustom"

      :searchForm="searchForm"
    ></EleListPage>
  </div>
</template>
<script>
export default {
  data() {
    const tableCommonOptions = {
      searchOptions: {
        isAllHidden: false,
        searchData: [
          {
            name: '出发区域',
            searchField: 'startArea',
            searchType: 'cascader',
            props:{
              checkStrictly: true,
              label:'name',
              value:'code',
              children:'subList'
            },
            selectList: [{
              name: '1',
              value: '11',
              subList: [{
                name: 'child',
                value: '1222'
              }]
            }]
          }]
      },
      filterOptions: {
        isAllHidden: false,
        left: [
          {
            filterType: 'add',
            disabled: false,
            type: 'info'
          },
          {
            filterType: 'invalid',
            disabled: false
          },
          {
            filterType: 'valid',
            disabled: false
          },
          {
            filterType: 'export',
            disabled: true
          },
          {
            filterType: 'customColumns'
          }
        ],
        right: [
          {
            filterType: 'search',
            fn: () => {
              this.loadTableData();
            }
          },
          {
            filterType: 'clear',
            fn: () => {
              this.searchForm = {};
              // 看是否需要调用搜索
              this.loadTableData();
            }
          },
        ]
      },
      tableOptions: {
        summaryMethod(param) {
          // const { columns, data } = param;
          const sums = ['总价','225元','','22'];
          return sums
        },
        underlineHandles: {
          code: ({row}) => {
            const params = {
              code: row.code || null 
            }
            alert('gotoDetail');
          }
        },
        columnsData: {
          showColumns: [{
            label: '编号',
            prop: 'code',
            width: 200
          },
          {
            label: '名称',
            prop: 'name',
            width: 150
          }],
          hiddenColumns: []
        },
        headerHandleOperation: {
          prop: 'operation',
          label: '操作',
          operationOptions: [{
            name: '修改',
            fn: ({row: {code}}) => {
              const params = {
                code
              }
              alert('gotoDetail');
            },
            disabled: false
          }, {
            name: '删除',
            type: 'danger',
            fn() {
              console.log('删除')
            },
            disabled: true,
          }]
        }
      },
      pagination: {
        total: 0,
        pageNo: 1,
        pageSize: 20
      }
    };
    return {
      a: true,
      tableCommonOptions,
      listLoading: false,
      searchForm: {
        // code1: []
      },
      tableList: [],
    }
  },
  methods: {
    requestSelectMethods({startPage, pageSize, total, queryValue}, selectList, obj, isClear = false) {
      // 核心 只要input为空或者输入 就清空且初始化
      if (isClear || queryValue === '' || queryValue === null) {
        obj.loadMoreOptions = {
          ...obj.loadMoreOptions,
          startPage: 1,
          total: 0,
        }
        obj.selectList = []
      }
      if (queryValue !== '' && queryValue !== null) {
        // 模拟真实请求：
        if (startPage === 1 || selectList.length < total) {
          // 示例
          // this.requestList({startPage, queryValue, pageSize}).then(({data, resTotal}) => {
          //   // data = [{value: 1, text: 1}]
          //   // 如果pageSize * startPage 最多能显示多少条 小于total 则可以继续加载， 否则不加载
          //   if (data?.length) {
          //     obj.selectList = obj.selectList.push(...(data || []))
          //     obj.loadMoreOptions = {
          //       ...obj.loadMoreOptions,
          //       startPage: startPage + 1,
          //       total: resTotal,
          //     }
          //   }
          // })
        }
      }
    },
    onSaveCustom(selectedNumber, closeDialog) {
      // 保存自定义列
      const request = {
        userModuleColumnsReqs: (selectedNumber || []).map((item, index) => {
          return {
            columnId: item,
            seq: index + 1
          }
        })
      };
      // 此处需要自己处理@TODO
      this.$store.dispatch('commodityInfoList/saveCustomColumns', request).then(() => {
        this.loadCustomColumnsList();
        // 更新列表数据
        this.loadTableData();
        closeDialog && closeDialog();
      })
      // 保存自定义列
    },
    loadSearchList() {
      // 初始化搜索项
      const searchData = this.tableCommonOptions.searchOptions.searchData;
      const newSearchData = [...searchData];
      // 搜索项下拉框列表填充
      // getSelectList().then(({data: result}) => {
      //   if (result) {
      //     for (let key in result) {
      //       searchData.forEach((item, index) => {
      //         if (key === item.searchField) {
      //           const selectList = [];
      //           result[key].forEach(resultChild => {
      //             selectList.push({
      //               text: resultChild.description,
      //               value: resultChild.code
      //             });
      //           });
      //           newSearchData[index].selectList = selectList;
      //         }
      //       });
      //     }
      //     this.tableCommonOptions.searchOptions.searchData = newSearchData;
      //   }
      // })
    },
    loadTableData() {
      const searchForm = this.searchForm;
      const request = {
        ...searchForm,
        startPage: this.tableCommonOptions.pagination.pageNo,
        pageSize: this.tableCommonOptions.pagination.pageSize
      }

      getTableList(request).then(({data: {data: tableList, total}}) => {

        // 表格数据更新
        this.tableList = tableList || [],
        this.tableCommonOptions.pagination = {
          ...this.tableCommonOptions.pagination,
          total
        }
      });

    },
    loadCustomColumnsList() {
      // 获取自定义列列表
      getCustomizedColumnsList().then(({data}) => {
        // 接口的数据结构showColumns = [{showName, showField, id, refField}]
        // table表头所需
        const columnsMatchParams = {
          prop: 'showField',
          label: 'showName'
        };
        // 自定义列所需
        const customColumnsMatchParams = {
          key: 'id',
          label: 'showName'
        }
        const tableCommonOptions = this.tableCommonOptions;

        tableCommonOptions.tableOptions = {
          ...tableCommonOptions.tableOptions,
            columnsData: data,
            columnsMatchParams,
            customColumnsMatchParams
        }
      })
    },
  },
  mounted() {
    // // 初始化搜索项
    // this.loadSearchList();
    // // 加载自定义列数据
    // this.loadCustomColumnsList();
    // 加载表格数据
    this.loadTableData();
  },
  activated() {
    // 如果页面使用keep-alive，可以在此处调用加载表格数据接口
  }

}

</script>
<style>
  html, body, #app {
    height: 100%;
    margin: 0;
  }

</style>` 
})


// 解析上下文里node原生请求的POST参数
function parsePostData(ctx) {
  return new Promise((resolve, reject) => {
    try {
      let postData = '';
      ctx.req.addListener('data', (data) => {
        postData += data
      })
      ctx.req.addListener('end', function() {
        let parseData = parseQueryStr(postData)
        resolve(parseData);
      })
    } catch (err) {
      reject(err)
    }
  })
}
function parseQueryStr(queryStr) {
  let queryData = {};
  let queryStrList = queryStr.split('&');
  for(let [index,queryStr] of queryStrList.entries()){
    let itemList = queryStr.split('=');
    queryData[itemList[0]] = decodeURIComponent(itemList[1]);
  }
  return queryData
}
