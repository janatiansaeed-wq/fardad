interface Props{

    title:string;

}

export default function Breadcrumb({

    title,

}:Props){

    return(

        <div>

            <h1>

                {title}

            </h1>

        </div>

    );

}