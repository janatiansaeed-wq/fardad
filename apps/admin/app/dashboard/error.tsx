"use client";

export default function Error({
  reset,

}:{
  error:Error;
  reset:()=>void;
}){

  return(

    <div>

      <h2>

        Dashboard Error

      </h2>

      <button
        onClick={reset}
      >
        Retry
      </button>

    </div>

  );

}
