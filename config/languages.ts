// config/languages.ts

export type LanguageConfig = {
  id: number;
  label: string;
  monacoLang: string;
  starterCode: string;
};

export const languages: LanguageConfig[] = [
  {
    id: 63,
    label: "JavaScript",
    monacoLang: "javascript",
    starterCode: `function reverseString(str) {
    // your code here
    return "";
  }
  
  console.log(reverseString("hello"));`,
  },
  {
    id: 71,
    label: "Python",
    monacoLang: "python",
    starterCode: `def reverse_string(s):
      # your code here
      return ""
  
  print(reverse_string("hello"))`,
  },
  {
    id: 54,
    label: "C++",
    monacoLang: "cpp",
    starterCode: `#include<iostream>
  using namespace std;
  
  string reverseString(string s) {
      // your code here
      return "";
  }
  
  int main() {
      cout << reverseString("hello");
      return 0;
  }`,
  },
  {
    id: 62,
    label: "Java",
    monacoLang: "java",
    starterCode: `public class Main {
      public static String reverseString(String s) {
          // your code here
          return "";
      }
  
      public static void main(String[] args) {
          System.out.println(reverseString("hello"));
      }
  }`,
  },
];
