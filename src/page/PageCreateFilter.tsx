import { Button, Input, Radio, RadioGroup, Slider } from "@nextui-org/react"
import { useState } from "react"
import { StoreFilter, store_filter } from "../serve_app/filter";
import { useNavigate } from "react-router-dom";
import { Toast } from "antd-mobile";


const PageCreateFilter = () => {
   const navigate = useNavigate();

   const [name, set_name] = useState("");
   const [max, set_max] = useState(0);//0不限制数量
   const [star, set_star] = useState<StoreFilter["is_star"]>(null);
   const [score_range, set_score_range] = useState<StoreFilter["score_range"]>(null);
   const [time_range, set_time_range] = useState<StoreFilter["time_range"]>(null);
   const [yes_no, set_yes_no] = useState<StoreFilter["yes_no"]>(null);
   const save = () => {
      if (name.length == 0) {
         Toast.show("名字不能为空")
         return;
      }
      // 为了方便允许 通过 同名 修改 配置
      const filter: StoreFilter = {
         name: name,
         max_word_num: max,
         is_star: star,
         score_range: score_range,
         time_range: time_range,
         yes_no: yes_no
      }
      store_filter.set_filter(filter);
      store_filter.value.save();
      Toast.show("保存成功")
   }
   return (<>
      <pre className="whitespace-pre-wrap">
         {"提醒1: 若没有限制最大单词量, 尽可能什么什么的并不会进行筛选\n"}
         {"提醒2: 筛选后会对单词组随机排序\n"}
         {"提醒3: 多个过滤器配合并非且运算而是或运算,也就是多个筛选器筛选后重新把单词组组合到一起而已"}
      </pre>


      <Input value={name} onValueChange={set_name} label="name" placeholder="Enter your filter name"></Input>
      <Slider label="最大单词量(0表示过滤不限制上限)"
         step={1}
         maxValue={1000}
         minValue={0}
         defaultValue={max}
         value={max}
         onChange={(v) => set_max(v as number)} />
      <RadioGroup
         label="是否是star"
         value={star ? "true" : star == null ? "null" : "false"}
         onValueChange={v => v == "true" ? set_star(true) : (v == "null" ? set_star(null) : set_star(false))}
         orientation="horizontal">
         <Radio value="true">是star</Radio>
         <Radio value="false">非star</Radio>
         <Radio value="null">不关心</Radio>
      </RadioGroup>
      <RadioGroup
         label="分值控制"
         value={score_range == null ? "null" : score_range[0]}
         onValueChange={v => {
            switch (v) {
               case "in": { set_score_range(["in", -100, 100]) } break;
               case "largest": { set_score_range(["largest"]) } break;
               case "lowest": { set_score_range(["lowest"]) } break;
               case "null": { set_score_range(null) } break;
            }
         }}
         orientation="horizontal">
         <Radio value="in">区间控制</Radio>
         <Radio value="largest">尽可能大</Radio>
         <Radio value="lowest">尽可能小</Radio>
         <Radio value="null">不关心</Radio>
      </RadioGroup>
      {
         score_range?.[0] == "in" ? <Slider
            label="区间控制-分数范围"
            step={1}
            maxValue={1000}
            minValue={-1000}
            value={[score_range[1], score_range[2]]}
            onChange={(v) => Array.isArray(v) ? set_score_range(["in", v[0], v[1]]) : null}
         /> : null
      }
      <RadioGroup
         label="时间控制"
         value={time_range == null ? "null" : time_range[0]}
         onValueChange={v => {
            switch (v) {
               case "in": { set_time_range(["in", 31, 7]) } break;
               case "recent": { set_time_range(["recent"]) } break;
               case "ago": { set_time_range(["ago"]) } break;
               case "null": { set_time_range(null) } break;
            }
         }}
         orientation="horizontal">
         <Radio value="in">区间控制</Radio>
         <Radio value="recent">尽可能最近遇到过的</Radio>
         <Radio value="ago">尽可能很久没有遇到过的</Radio>
         <Radio value="null">不关心</Radio>
      </RadioGroup>
      {
         time_range?.[0] == "in" ? <Slider
            label="区间控制-时间范围([0,7],现在到过去7天遇见的单词)"
            step={1}
            maxValue={365}
            minValue={0}
            value={[time_range[2], time_range[1]]}
            onChange={(v) => Array.isArray(v) ? set_time_range(["in", v[1], v[0]]) : null}
         /> : null
      }
      <RadioGroup
         label="正确错误条件控制"
         value={yes_no == null ? "null" : yes_no[0]}
         onValueChange={v => {
            switch (v) {
               case "yes>=no": { set_yes_no(["yes>=no"]) } break;
               case "no>=yes": { set_yes_no(["no>=yes"]) } break;
               case "null": { set_yes_no(null) } break;
            }
         }}
         orientation="horizontal">
         <Radio value="yes>=no">正确的次数大于等于错误的次数</Radio>
         <Radio value="no>=yes">错误的次数大于等于正确的次数</Radio>
         <Radio value="null">不关心</Radio>
      </RadioGroup>
      <Button onPress={() => navigate(-1)} >返回</Button>
      <Button color="success" onPress={save} >保存</Button>

   </>)
}

export default PageCreateFilter