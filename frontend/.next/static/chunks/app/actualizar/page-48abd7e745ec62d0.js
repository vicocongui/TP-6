(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[702],{8928:function(a,e,t){Promise.resolve().then(t.bind(t,8273))},8273:function(a,e,t){"use strict";t.r(e);var r=t(7437),n=t(2265),o=t(5474);let u={mensaje:""};e.default=function(){let[a,e]=(0,n.useState)(u),t=async a=>{var t,r;a.preventDefault();let n=new FormData(a.currentTarget),u=null===(t=n.get("usuario"))||void 0===t?void 0:t.toString(),l=null===(r=n.get("nombreWeb"))||void 0===r?void 0:r.toString();if(u&&l)try{let a=await (0,o.E$)(u,l);e({mensaje:"Cuenta actualizada con \xe9xito: ".concat(a.usuario)})}catch(a){a instanceof Error?e({mensaje:"Error al actualizar la cuenta: ".concat(a.message)}):e({mensaje:"Error desconocido al actualizar la cuenta."})}else e({mensaje:"Falta el nombre de la cuenta o del usuario!"})};return(0,r.jsxs)("div",{className:"bg-zinc-950 rounded p-8",children:[(0,r.jsx)("h2",{className:"text-2xl font-bold mb-5",children:"Actualizar Cuenta"}),a.mensaje&&(0,r.jsx)("div",{role:"alert",className:"alert alert-info",children:(0,r.jsx)("span",{children:a.mensaje})}),(0,r.jsxs)("form",{onSubmit:t,children:[(0,r.jsx)("input",{name:"usuario",placeholder:"Nombre del usuario...",type:"text",className:"input input-bordered w-full m-1 max-w-xs",required:!0}),(0,r.jsx)("input",{name:"nombreWeb",placeholder:"Nombre de la web...",type:"text",className:"input input-bordered w-full m-1 max-w-xs",required:!0}),(0,r.jsx)("button",{className:"btn btn-primary m-1",type:"submit",children:"Actualizar"})]})]})}},5474:function(a,e,t){"use strict";t.d(e,{E$:function(){return o},FP:function(){return n}});var r=t(4844);let n=async(a,e)=>{try{return(await r.Z.post("http://localhost:5000/v1/listado/add-account",{usuario:a,nombreWeb:e})).data}catch(a){throw console.error("Error al agregar la cuenta:",a),Error("No se pudo agregar la cuenta")}},o=async(a,e)=>{try{return(await r.Z.put("http://localhost:5000/v1/usuario/update",{usuario:a,nombreWeb:e})).data}catch(a){throw console.error("Error al actualizar la cuenta:",a),Error("No se pudo actualizar la cuenta")}}}},function(a){a.O(0,[844,971,23,744],function(){return a(a.s=8928)}),_N_E=a.O()}]);