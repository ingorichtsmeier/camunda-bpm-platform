/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership. Camunda licenses this file to you under the Apache License,
 * Version 2.0; you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useRef, useEffect, useState } from "react";

import setup from "./angularModuleSetup";

import angular from "angular";

export default function AngularApp({ component }) {
  const ref = useRef(null);
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    const promise = new Promise(resolve => {
      const { node, module } = component();

      setup(module, setPlugins);

      const domNode = ref.current;
      domNode.appendChild(node);

      node.classList.add("angular-app");

      angular.bootstrap(node, [module.name]);
      resolve({ node, domNode });
    });

    return () => {
      promise.then(({ node, domNode }) => {
        angular
          .element(node)
          .scope()
          .$destroy();
        domNode.removeChild(node);
      });
    };
  }, [component]);

  return (
    <>
      <div ref={ref} />
      {plugins}
    </>
  );
}
