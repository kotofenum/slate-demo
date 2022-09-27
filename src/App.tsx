import "./App.scss";
import { InterviewEditor } from "./components/interview-editor";
// import { InterviewEditor } from "./components/interview-editor";
import { Interview } from "./components/interview-editor/interview";
import { InterviewItem } from "./components/interview-editor/interview-item";
import { IRole } from "./components/interview-editor/interview-item/InterviewItem";

const roles: IRole[] = [
  {
    id: "1",
    label: "Интервьюер",
  },
  {
    id: "2",
    label: "Респондент",
  },
];

function App() {
  return (
    <div className="App">
      <div className="AppEditor">
        <Interview>
          <InterviewEditor />
          {/* <InterviewItem role={roles[0]}>
            Вам, наверное, пришло уведомление, что запись началась?
          </InterviewItem>
          <InterviewItem role={roles[1]}>Да.</InterviewItem>
          <InterviewItem role={roles[0]}>
            Хорошо, тогда давайте немного знакомиться с вами. Галина, скажите
            пожалуйста, в каком городе проживаете, сколько вам лет и чем вы
            вообще занимаетесь?
          </InterviewItem>
          <InterviewItem role={roles[1]}>
            Мне 55 полных лет, я живу в Москве, я переводчик, а также
            персональный ассистент, работаю в компании по производству
            спортивных товаров.
          </InterviewItem> */}
        </Interview>
      </div>
    </div>
  );
}

export default App;
