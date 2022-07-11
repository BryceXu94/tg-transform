/*
 * @Descripttion: 动态渲染dialog组件 -> 参考element-plus中message方法。
 * @Author: weitongxue
 */
import { createVNode, render, Component } from 'vue';
import { app } from '@/main'; // 根节点

/**
 * el: dialog组件
 * params: 参数：对应render函数的第二个参数（attr, prop, methods）
 */

// 创建一个div实例，用于渲染虚拟dom
const instance = document.createElement('div');
const appendTo = document.body;
// 销毁组件
const onDestroy = () => {
  render(null, instance);
};

export const handleOpenDialog = <T>(el: Component, params?: T) => {
  // 创建虚拟dom
  const vNode = createVNode(el, { ...params, onDestroy });
  // 在根VNode上存储应用程序上下文。
  vNode.appContext = app._context;
  // 将虚拟dom渲染成实例
  render(vNode, instance);
  // 插入实例
  appendTo.appendChild(instance);
};
