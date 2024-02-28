import {
    createContext,
    useContext,
    useReducer,
  } from "react";
  
  import {CurrentUserDataContext} from './CurrentUserDataContext'
  
  export const SelectedChatContext = createContext();
  
  export const ChatContextProvider = ({ children }) => {
    
    const { currentUserData } = useContext(CurrentUserDataContext);
    const INITIAL_STATE = {
      chatId: "null",
      user: {},
    };
  
    const chatReducer = (state, action) => {
      switch (action.type) {
        case "CHANGE_USER":
          return {
            user: action.payload,
            chatId:
            currentUserData.uid > action.payload.uid
                ? currentUserData.uid + action.payload.uid
                : action.payload.uid + currentUserData.uid,
          };
  
        default:
          return state;
      }
    };
  
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  
    return (
      <SelectedChatContext.Provider value={{ data:state, dispatch }}>
        {children}
      </SelectedChatContext.Provider>
    );
  };
  
  
  
  
  
  