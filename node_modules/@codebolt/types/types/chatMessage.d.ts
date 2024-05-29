


export interface ChatMessage {
    type: string;
    message: Message | string;
  }
  
  interface Message {
    id?: string;
    object?: string;
    created: number;
    model?: string;
    choices?: Choice[];
    usage?: Usage;
    system_fingerprint?: string;
  }
  
  interface Choice {
    index: number;
    message: MessageContent;
    logprobs?: any; 
    finish_reason: string;
  }
  
  interface MessageContent {
    role: string;
    content: string;
  }
  interface Usage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  }

